import { type SQL, sql, count, asc, desc, eq } from "drizzle-orm";
import type { CourseDatasource } from "../../domain/datasources";
import type { ListResponseEntity, CourseEntity } from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, CourseMapper } from "../mappers";
import type { CourseQuery } from "../../domain/types";
import { db, courses, teachers, classrooms } from "../../db";
import { CustomError } from "../../domain/errors";
import type { CreateCourseDTO, PatchCourseDTO } from "../../domain/dtos/course";

type CourseQueryFilters = Omit<CourseQuery, "sortDir" | "ordering">;

export class CourseDatasourceImpl implements CourseDatasource {
  async findAll(query: QueryParams): Promise<ListResponseEntity<CourseEntity>> {
    const { limit, offset, otherParams } = query;
    const { sortDir, ordering, classroomId, teacherId } =
      CourseMapper.courseQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({ classroomId, teacherId });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return ListResponseMapper.listResponseFromEntities(
        { count: 0, limit, offset },
        [],
        "course"
      );
    }

    let qb = db.select().from(courses).$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      order =
        sortDir === "asc" ? asc(courses[ordering]) : desc(courses[ordering]);
    } else order = desc(courses.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const entities = result.map((course) =>
      CourseMapper.toCourseEntity(course)
    );

    return ListResponseMapper.listResponseFromEntities(
      { limit, offset, count: countResult },
      entities,
      "course"
    );
  }

  async findOne(id: CourseEntity["id"]): Promise<CourseEntity> {
    const result = await db.select().from(courses).where(eq(courses.id, id));

    if (!result.length) throw CustomError.notFound("Course not found.");

    return CourseMapper.toCourseEntity(result[0]);
  }

  async create(createCourseDTO: CreateCourseDTO): Promise<CourseEntity> {
    if (createCourseDTO.teacherId) {
      const existingTeacher = await db
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.id, createCourseDTO.teacherId));

      if (!existingTeacher.length) {
        throw CustomError.badRequest("Teacher with 'teacherId' not found.");
      }
    }

    if (createCourseDTO.classroomId) {
      const existingTeacher = await db
        .select({ id: classrooms.id })
        .from(classrooms)
        .where(eq(classrooms.id, createCourseDTO.classroomId));

      if (!existingTeacher.length) {
        throw CustomError.badRequest("Classroom with 'classroomId' not found.");
      }
    }

    const result = await db
      .insert(courses)
      .values(createCourseDTO)
      .onConflictDoNothing({ target: courses.code })
      .returning();

    if (!result.length) {
      throw CustomError.badRequest("'code' already take.");
    }

    return CourseMapper.toCourseEntity(result[0]);
  }

  async patch(
    id: CourseEntity["id"],
    patchCourseDTO: PatchCourseDTO
  ): Promise<{ courseId: CourseEntity["id"] }> {
    try {
      const result = await db
        .update(courses)
        .set(patchCourseDTO)
        .where(eq(courses.id, id))
        .returning({ courseId: courses.id });

      if (!result.length) {
        throw CustomError.notFound("Failed to updated, course not found.");
      }

      return result[0];
      // biome-ignore lint/suspicious/noExplicitAny: there was no other way
    } catch (error: any) {
      if (error.code === "23503") {
        throw CustomError.badRequest(
          "Failed to patch, teacher with 'teacherId' not found."
        );
      }
      if (error.code === "23505") {
        throw CustomError.badRequest("'code' already taken.");
      }
      throw error;
    }
  }

  async remove(id: CourseEntity["id"]): Promise<void> {
    const result = await db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning({ deletedId: courses.id });

    if (!result.length) {
      throw CustomError.notFound(
        `The course with id: '${id}' could not be found, failed to delete`
      );
    }
  }

  private withFilters({
    classroomId,
    teacherId,
  }: CourseQueryFilters): SQL | undefined {
    const filterSQls: SQL[] = [];
    if (classroomId) {
      filterSQls.push(sql`${courses.classroomId} = ${classroomId}`);
    }

    if (teacherId) {
      filterSQls.push(sql`${courses.teacherId} = ${teacherId}`);
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db.select({ count: count() }).from(courses).$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }
}
