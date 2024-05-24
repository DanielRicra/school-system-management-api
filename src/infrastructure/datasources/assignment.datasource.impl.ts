import { type SQL, sql, count, asc, desc, eq, isNull } from "drizzle-orm";
import type { AssignmentDatasource } from "../../domain/datasources";
import {
  ListResponseEntity,
  type AssignmentEntity,
} from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, AssignmentMapper } from "../mappers";
import type { AssignmentQuery } from "../../domain/types";
import { db, assignments, courses } from "../../db";
import { CustomError } from "../../domain/errors";
import type {
  CreateAssignmentDTO,
  PatchAssignmentDTO,
} from "../../domain/dtos/assignment";

type AssignmentQueryFilters = Omit<AssignmentQuery, "sortDir" | "ordering">;

export class AssignmentDatasourceImpl implements AssignmentDatasource {
  async findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<AssignmentEntity>> {
    const { limit, offset, otherParams } = query;
    const { sortDir, ordering, courseId, dueDateSection } =
      AssignmentMapper.assignmentQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({ courseId, dueDateSection });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return new ListResponseEntity();
    }

    let qb = db.select().from(assignments).$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      order =
        sortDir === "asc"
          ? asc(assignments[ordering])
          : desc(assignments[ordering]);
    } else order = desc(assignments.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const entities = result.map((assignment) =>
      AssignmentMapper.toAssignmentEntity(assignment)
    );

    return ListResponseMapper.listResponseFromEntities(
      { limit, offset, count: countResult },
      entities,
      "assignments"
    );
  }

  async findOne(id: AssignmentEntity["id"]): Promise<AssignmentEntity> {
    const result = await db
      .select()
      .from(assignments)
      .where(eq(assignments.id, id));

    if (!result.length) throw CustomError.notFound("Assignment not found.");

    return AssignmentMapper.toAssignmentEntity(result[0]);
  }

  async create(
    createAssignmentDTO: CreateAssignmentDTO
  ): Promise<AssignmentEntity> {
    if (createAssignmentDTO.courseId) {
      const existingCourse = await db
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.id, createAssignmentDTO.courseId));

      if (!existingCourse.length) {
        throw CustomError.badRequest("Course with 'courseId' not found.");
      }
    }

    const result = await db
      .insert(assignments)
      .values(createAssignmentDTO)
      .returning();

    if (!result.length) {
      throw CustomError.badRequest("Course with 'courseId' not found.");
    }

    return AssignmentMapper.toAssignmentEntity(result[0]);
  }

  async patch(
    id: AssignmentEntity["id"],
    patchAssignmentDTO: PatchAssignmentDTO
  ): Promise<{ assignmentId: AssignmentEntity["id"] }> {
    if (patchAssignmentDTO.courseId) {
      const existingCourse = await db
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.id, patchAssignmentDTO.courseId));

      if (!existingCourse.length) {
        throw CustomError.badRequest("Course with 'courseId' not found.");
      }
    }

    const result = await db
      .update(assignments)
      .set(patchAssignmentDTO)
      .where(eq(assignments.id, id))
      .returning({ assignmentId: assignments.id });

    if (!result.length) {
      throw CustomError.notFound("Failed to updated, assignment not found.");
    }

    return result[0];
  }

  async remove(id: AssignmentEntity["id"]): Promise<void> {
    const result = await db
      .delete(assignments)
      .where(eq(assignments.id, id))
      .returning({ deletedId: assignments.id });

    if (!result.length) {
      throw CustomError.notFound(
        `The assignment with id: '${id}' could not be found, failed to delete`
      );
    }
  }

  private withFilters({
    courseId,
    dueDateSection,
  }: AssignmentQueryFilters): SQL | undefined {
    const filterSQls: SQL[] = [];
    if (courseId) {
      filterSQls.push(sql`${assignments.courseId} = ${courseId}`);
    }

    if (dueDateSection) {
      switch (dueDateSection) {
        case "no_date":
          filterSQls.push(isNull(assignments.dueDate));
          break;
        case "past_due":
          filterSQls.push(sql`${assignments.dueDate} < now()`);
          break;
        case "today":
          filterSQls.push(sql`DATE(${assignments.dueDate}) = CURRENT_DATE`);
          break;
        case "upcoming":
          filterSQls.push(sql`${assignments.dueDate} > now()`);
      }
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db.select({ count: count() }).from(assignments).$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }
}
