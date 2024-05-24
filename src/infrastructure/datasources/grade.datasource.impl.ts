import { type SQL, sql, count, asc, desc, eq } from "drizzle-orm";
import type { GradeDatasource } from "../../domain/datasources";
import type { ListResponseEntity, GradeEntity } from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, GradeMapper } from "../mappers";
import type { GradeQuery } from "../../domain/types";
import { db, grades, assignments, students } from "../../db";
import { CustomError } from "../../domain/errors";
import type { CreateGradeDTO, PatchGradeDTO } from "../../domain/dtos/grade";

type GradeQueryFilters = Omit<GradeQuery, "sortDir" | "ordering">;

export class GradeDatasourceImpl implements GradeDatasource {
  async findAll(query: QueryParams): Promise<ListResponseEntity<GradeEntity>> {
    const { limit, offset, otherParams } = query;
    const { sortDir, ordering, assignmentId, gradeGte, gradeLte, studentId } =
      GradeMapper.gradeQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({
      assignmentId,
      gradeGte,
      gradeLte,
      studentId,
    });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return ListResponseMapper.listResponseFromEntities(
        { count: 0, limit, offset },
        [],
        "grade"
      );
    }

    let qb = db.select().from(grades).$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      order =
        sortDir === "asc" ? asc(grades[ordering]) : desc(grades[ordering]);
    } else order = desc(grades.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const entities = result.map((grade) => GradeMapper.toGradeEntity(grade));

    return ListResponseMapper.listResponseFromEntities(
      { limit, offset, count: countResult },
      entities,
      "grades"
    );
  }

  async findOne(id: GradeEntity["id"]): Promise<GradeEntity> {
    const result = await db.select().from(grades).where(eq(grades.id, id));

    if (!result.length) throw CustomError.notFound("Grade not found.");

    return GradeMapper.toGradeEntity(result[0]);
  }

  async create(createGradeDTO: CreateGradeDTO): Promise<GradeEntity> {
    const { assignmentId, studentId } = createGradeDTO;
    if (assignmentId) {
      const existingAssignment = await db
        .select({ id: assignments.id })
        .from(assignments)
        .where(eq(assignments.id, assignmentId));

      if (!existingAssignment.length) {
        throw CustomError.badRequest(
          "Assignment with 'assignmentId' not found."
        );
      }
    }

    if (studentId) {
      const existingTeacher = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.id, studentId));

      if (!existingTeacher.length) {
        throw CustomError.badRequest("Student with 'studentId' not found.");
      }
    }

    const result = await db.insert(grades).values(createGradeDTO).returning();

    return GradeMapper.toGradeEntity(result[0]);
  }

  async patch(
    id: GradeEntity["id"],
    patchGradeDTO: PatchGradeDTO
  ): Promise<{ gradeId: GradeEntity["id"] }> {
    try {
      if (patchGradeDTO.assignmentId) {
        const existingAssignment = await db
          .select({ id: assignments.id })
          .from(assignments)
          .where(eq(assignments.id, patchGradeDTO.assignmentId));

        if (!existingAssignment.length) {
          throw CustomError.badRequest(
            "Assignment with 'assignmentId' not found."
          );
        }
      }

      const result = await db
        .update(grades)
        .set(patchGradeDTO)
        .where(eq(grades.id, id))
        .returning({ gradeId: grades.id });

      if (!result.length) {
        throw CustomError.notFound("Failed to updated, grade not found.");
      }

      return result[0];
      // biome-ignore lint/suspicious/noExplicitAny: there was no other way
    } catch (error: any) {
      if (error.code === "23503") {
        console.log(error);
        throw CustomError.badRequest(
          "Failed to patch, student with 'studentId' not found."
        );
      }
      throw error;
    }
  }

  async remove(id: GradeEntity["id"]): Promise<void> {
    const result = await db
      .delete(grades)
      .where(eq(grades.id, id))
      .returning({ deletedId: grades.id });

    if (!result.length) {
      throw CustomError.notFound(
        `Grade with id: '${id}' not found, failed to delete`
      );
    }
  }

  private withFilters({
    assignmentId,
    gradeGte,
    gradeLte,
    studentId,
  }: GradeQueryFilters): SQL | undefined {
    const filterSQls: SQL[] = [];

    if (assignmentId) {
      filterSQls.push(sql`${grades.assignmentId} = ${assignmentId}`);
    }
    if (studentId) {
      filterSQls.push(sql`${grades.studentId} = ${studentId}`);
    }
    if (gradeGte !== undefined) {
      filterSQls.push(sql`${grades.grade} >= ${gradeGte}`);
    }
    if (gradeLte !== undefined) {
      filterSQls.push(sql`${grades.grade} <= ${gradeLte}`);
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db.select({ count: count() }).from(grades).$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }
}
