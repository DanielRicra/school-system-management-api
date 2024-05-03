import { type SQL, sql, count, asc, desc, eq, DrizzleError } from "drizzle-orm";
import type { StudentDatasource } from "../../domain/datasources";
import type { ListResponseEntity, StudentEntity } from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, StudentMapper } from "../mappers";
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
    const { sortDir, classroomId, enrollmentStatus, gradeLevel, ordering } =
      StudentMapper.studentQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({
      classroomId,
      enrollmentStatus,
      gradeLevel,
    });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return ListResponseMapper.listResponseFromEntities(
        { count: 0, limit, offset },
        [],
        "student"
      );
    }

    let qb = db.select().from(students).$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      order =
        sortDir === "asc" ? asc(students[ordering]) : desc(students[ordering]);
    } else order = desc(students.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const entities = result.map((student) =>
      StudentMapper.toStudentEntity(student)
    );

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

  private withFilters({
    classroomId,
    enrollmentStatus,
    gradeLevel,
  }: StudentQueryFilters): SQL | undefined {
    const filterSQls: SQL[] = [];
    if (classroomId) {
      filterSQls.push(sql`${students.classroomId} = ${classroomId}`);
    }
    if (enrollmentStatus) {
      filterSQls.push(sql`${students.enrollmentStatus} = ${enrollmentStatus}`);
    }
    if (gradeLevel) {
      filterSQls.push(sql`${students.gradeLevel} = ${gradeLevel}`);
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db.select({ count: count() }).from(students).$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }
}
