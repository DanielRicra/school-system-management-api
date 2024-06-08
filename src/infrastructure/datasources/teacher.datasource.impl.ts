import { type SQL, sql, count, asc, desc, eq } from "drizzle-orm";
import type { TeacherDatasource } from "../../domain/datasources";
import { ListResponseEntity, type TeacherEntity } from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, TeacherMapper, UserMapper } from "../mappers";
import type { TeacherQuery } from "../../domain/types";
import { db, teachers, users } from "../../db";
import { CustomError } from "../../domain/errors";
import type {
  CreateTeacherDTO,
  PatchTeacherDTO,
} from "../../domain/dtos/teacher";
import { getTeachersWithUser } from "../../db/queries";

type TeacherQueryFilters = Omit<TeacherQuery, "sortDir" | "ordering">;

export class TeacherDatasourceImpl implements TeacherDatasource {
  async findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<TeacherEntity>> {
    const { limit, offset, otherParams } = query;
    const { sortDir, ordering, department } =
      TeacherMapper.teacherQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({
      department,
    });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return new ListResponseEntity();
    }

    let qb = getTeachersWithUser().$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      order =
        sortDir === "asc" ? asc(teachers[ordering]) : desc(teachers[ordering]);
    } else order = desc(teachers.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const entities = result.map((teacher) => {
      const userEntity = UserMapper.toUserEntity(teacher.user);
      return TeacherMapper.toTeacherEntity({ ...teacher, user: userEntity });
    });

    return ListResponseMapper.listResponseFromEntities(
      { limit, offset, count: countResult },
      entities,
      "teachers"
    );
  }

  async findOne(id: string): Promise<TeacherEntity> {
    const result = await db.select().from(teachers).where(eq(teachers.id, id));

    if (!result.length) throw CustomError.notFound("Teacher not found.");

    return TeacherMapper.toTeacherEntity(result[0]);
  }

  async create(createTeacherDTO: CreateTeacherDTO): Promise<TeacherEntity> {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, createTeacherDTO.userId));

    if (!existingUser.length) {
      throw CustomError.badRequest("User with userId not found.");
    }

    const result = await db
      .insert(teachers)
      .values(createTeacherDTO)
      .onConflictDoNothing({ target: teachers.userId })
      .returning();

    if (!result.length) {
      throw CustomError.badRequest("'userId' already belongs to a teacher.");
    }

    return TeacherMapper.toTeacherEntity(result[0]);
  }

  async patch(
    id: string,
    patchTeacherDTO: PatchTeacherDTO
  ): Promise<{ teacherId: string }> {
    try {
      const result = await db
        .update(teachers)
        .set(patchTeacherDTO)
        .where(eq(teachers.id, id))
        .returning({ teacherId: teachers.id });

      if (!result.length) {
        throw CustomError.notFound("Failed to updated, teacher not found.");
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
        throw CustomError.badRequest("'userId' already belongs to a teacher.");
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await db
      .delete(teachers)
      .where(eq(teachers.id, id))
      .returning({ deletedId: teachers.id });

    if (!result.length) {
      throw CustomError.notFound(
        `The teacher with id: '${id}' could not be found, failed to delete`
      );
    }
  }

  private withFilters({ department }: TeacherQueryFilters): SQL | undefined {
    const filterSQls: SQL[] = [];
    if (department) {
      filterSQls.push(sql`${teachers.department} = ${department}`);
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db.select({ count: count() }).from(teachers).$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }
}
