import { type SQL, sql, count, asc, desc, eq } from "drizzle-orm";
import type { StudentDatasource } from "../../domain/datasources";
import type { ListResponseEntity, StudentEntity } from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, StudentMapper } from "../mappers";
import type { StudentQuery } from "../../domain/types";
import { classrooms, db, students, users } from "../../db";
import { CustomError } from "../../domain/errors";
import type { CreateStudentDTO } from "../../domain/dtos/student";

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

    if (!result.length) throw CustomError.notFound("User not found.");

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
