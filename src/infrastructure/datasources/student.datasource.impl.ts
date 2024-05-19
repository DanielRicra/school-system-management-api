import { type SQL, sql, count, asc, desc, eq, ilike } from "drizzle-orm";
import type { StudentDatasource } from "../../domain/datasources";
import { ListResponseEntity, type StudentEntity } from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, StudentMapper, UserMapper } from "../mappers";
import type { StudentQuery } from "../../domain/types";
import { classrooms, db, students, users } from "../../db";
import { CustomError } from "../../domain/errors";
import type {
  CreateStudentDTO,
  PatchStudentDTO,
} from "../../domain/dtos/student";

type StudentQueryFilters = Omit<StudentQuery, "sortDir" | "ordering">;

export class StudentDatasourceImpl implements StudentDatasource {
  async findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<StudentEntity>> {
    const { limit, offset, otherParams } = query;
    const {
      sortDir,
      classroomId,
      enrollmentStatus,
      gradeLevel,
      ordering,
      firstName,
      surname,
    } = StudentMapper.studentQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({
      classroomId,
      enrollmentStatus,
      gradeLevel,
      firstName,
      surname,
    });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return new ListResponseEntity();
    }

    let qb = db
      .select({
        id: students.id,
        gradeLevel: students.gradeLevel,
        classroomId: students.classroomId,
        userId: students.userId,
        enrollmentStatus: students.enrollmentStatus,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        user: users,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      if (ordering === "firstName" || ordering === "surname") {
        order =
          sortDir === "asc" ? asc(users[ordering]) : desc(users[ordering]);
      } else {
        order =
          sortDir === "asc"
            ? asc(students[ordering])
            : desc(students[ordering]);
      }
    } else order = desc(students.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const entities = result.map((student) => {
      const userEntity = UserMapper.toUserEntity(student.user);
      return StudentMapper.toStudentEntity({ ...student, user: userEntity });
    });

    return ListResponseMapper.listResponseFromEntities(
      { limit, offset, count: countResult },
      entities,
      "student"
    );
  }

  async findOne(id: string): Promise<StudentEntity> {
    const result = await db.select().from(students).where(eq(students.id, id));

    if (!result.length) throw CustomError.notFound("Student not found.");

    return StudentMapper.toStudentEntity(result[0]);
  }

  async create(createStudentDTO: CreateStudentDTO): Promise<StudentEntity> {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, createStudentDTO.userId));

    if (!existingUser.length) {
      throw CustomError.badRequest("User with userId not found.");
    }

    if (createStudentDTO.classroomId) {
      const existingClassroom = await db
        .select({ gradeLevel: classrooms.gradeLevel })
        .from(classrooms)
        .where(eq(classrooms.id, createStudentDTO.classroomId));

      if (!existingClassroom.length) {
        throw CustomError.badRequest("Classroom with classroomId not found.");
      }
      if (existingClassroom[0].gradeLevel !== createStudentDTO.gradeLevel) {
        throw CustomError.badRequest(
          "A student should not be assigned to a classroom that does not correspond to their grade level."
        );
      }
    }

    const result = await db
      .insert(students)
      .values(createStudentDTO)
      .onConflictDoNothing({ target: students.userId })
      .returning();

    if (!result.length) {
      throw CustomError.badRequest("'userId' already belongs to a student.");
    }

    return StudentMapper.toStudentEntity(result[0]);
  }

  async patch(
    id: string,
    patchStudentDTO: PatchStudentDTO
  ): Promise<{ studentId: string }> {
    const { gradeLevel, classroomId } = patchStudentDTO;

    if (gradeLevel || classroomId) {
      await this.checkStudentGradeLevel(
        patchStudentDTO,
        gradeLevel,
        classroomId,
        id
      );
    }

    try {
      const result = await db
        .update(students)
        .set(patchStudentDTO)
        .where(eq(students.id, id))
        .returning({ studentId: students.id });

      if (!result.length) {
        throw CustomError.notFound("Failed to patch, student not found.");
      }

      return result[0];
      // biome-ignore lint/suspicious/noExplicitAny: there was no other way
    } catch (error: any) {
      if (error.code === "23503") {
        throw CustomError.badRequest(
          "Failed to patch, user with 'userId' not found."
        );
      }
      if (error.code === "23505") {
        throw CustomError.badRequest("'userId' already belongs to a student.");
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await db
      .delete(students)
      .where(eq(students.id, id))
      .returning({ deletedId: students.id });

    if (!result.length) {
      throw CustomError.notFound(
        `The student with id: '${id}' could not be found, failed to delete`
      );
    }
  }

  private async checkStudentGradeLevel(
    patchStudentDTO: PatchStudentDTO,
    gradeLevel: string | undefined,
    classroomId: number | null | undefined,
    studentId: string
  ) {
    const existingStudent = await db
      .select({ gradeLevel: students.gradeLevel })
      .from(students)
      .where(eq(students.id, studentId));

    if (classroomId) {
      const existingClassroom = await db
        .select({ gradeLevel: classrooms.gradeLevel })
        .from(classrooms)
        .where(eq(classrooms.id, classroomId));

      if (!existingClassroom.length) {
        throw CustomError.badRequest("Classroom with classroomId not found.");
      }

      if (gradeLevel && existingClassroom[0].gradeLevel !== gradeLevel) {
        throw CustomError.badRequest(
          "A student should not be assigned to a classroom that does not correspond to their grade level."
        );
      }

      if (!gradeLevel) {
        if (
          existingStudent[0] &&
          existingClassroom[0].gradeLevel !== existingStudent[0].gradeLevel
        ) {
          throw CustomError.badRequest(
            "A student should not be assigned to a classroom that does not correspond to their grade level."
          );
        }
      }
    }

    if (gradeLevel && !classroomId) {
      if (existingStudent[0] && existingStudent[0].gradeLevel !== gradeLevel) {
        patchStudentDTO.classroomId = null;
      }
    }
  }

  private withFilters(queryFilters: StudentQueryFilters): SQL | undefined {
    const { classroomId, enrollmentStatus, gradeLevel, firstName, surname } =
      queryFilters;

    const filterSQls: SQL[] = [];

    if (classroomId) {
      filterSQls.push(sql`${students.classroomId} = ${classroomId}`);
    }

    if (enrollmentStatus) {
      const esFilter = sql`(`;
      for (let i = 0; i < enrollmentStatus.length; i++) {
        esFilter.append(
          sql`${students.enrollmentStatus} = ${enrollmentStatus[i]}`
        );
        if (i === enrollmentStatus.length - 1) continue;
        esFilter.append(sql` or `);
      }
      esFilter.append(sql`)`);
      filterSQls.push(esFilter);
    }

    if (gradeLevel) {
      const glFilter = sql`(`;
      for (let i = 0; i < gradeLevel.length; i++) {
        glFilter.append(sql`${students.gradeLevel} = ${gradeLevel[i]}`);
        if (i === gradeLevel.length - 1) continue;
        glFilter.append(sql` or `);
      }
      glFilter.append(sql`)`);
      filterSQls.push(glFilter);
    }

    if (firstName) {
      filterSQls.push(ilike(users.firstName, `%${firstName}%`));
    }

    if (surname) {
      filterSQls.push(ilike(users.surname, `%${surname}%`));
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db
      .select({ count: count() })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }
}
