import { type SQL, asc, desc, sql, count } from "drizzle-orm";
import { classrooms, db } from "../../db";
import type { ClassroomDatasource } from "../../domain/datasources";
import type {
  CreateClassroomDTO,
  UpdateClassroomDTO,
} from "../../domain/dtos/classroom";
import type {
  ListResponseEntity,
  ClassroomEntity,
} from "../../domain/entities";
import type { ClassroomQuery } from "../../domain/types";
import type { QueryParams } from "../../types";
import { ClassroomMapper, ListResponseMapper } from "../mappers";

export class ClassroomDatasourceImpl implements ClassroomDatasource {
  async findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<ClassroomEntity>> {
    const { limit, offset, otherParams } = query;
    const { sortDir, gradeLevel, ordering, roomId, section, year } =
      ClassroomMapper.classroomQueryFromQueryParams(otherParams);

    const count = await this.count({
      sortDir,
      ordering,
      gradeLevel,
      roomId,
      section,
      year,
    });

    if (count === 0) {
      return ListResponseMapper.listResponseFromEntities(
        { count: 0, limit, offset },
        [],
        "classroom"
      );
    }

    let qb = db.select().from(classrooms).$dynamic();

    if (roomId || gradeLevel || section || year) {
      qb = qb.where(this.withFilters({ roomId, gradeLevel, section, year }));
    }

    let order: SQL<unknown>;
    if (ordering) {
      order =
        sortDir === "asc"
          ? asc(classrooms[ordering])
          : desc(classrooms[ordering]);
    } else order = desc(classrooms.createdAt);

    const classroomsFromDb = await qb
      .limit(limit)
      .offset(offset)
      .orderBy(order);

    const classroomEntities = classroomsFromDb.map((classroom) =>
      ClassroomMapper.classroomEntityFromObject(classroom)
    );

    return ListResponseMapper.listResponseFromEntities(
      { count, limit, offset },
      classroomEntities,
      "classroom"
    );
  }

  async count(query: ClassroomQuery): Promise<number> {
    let qb = db.select({ count: count() }).from(classrooms).$dynamic();

    if (query.roomId || query.gradeLevel || query.section || query.year) {
      qb = qb.where(this.withFilters(query));
    }

    const response = await qb;
    return response[0].count;
  }

  findOne(id: number): Promise<ClassroomEntity> {
    throw new Error("Method not implemented.");
  }

  create(createClassroomDTO: CreateClassroomDTO): Promise<ClassroomEntity> {
    throw new Error("Method not implemented.");
  }

  update(
    id: number,
    updateClassroomDTO: UpdateClassroomDTO
  ): Promise<ClassroomEntity> {
    throw new Error("Method not implemented.");
  }

  remove(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private withFilters({
    gradeLevel,
    roomId,
    section,
    year,
  }: Omit<ClassroomQuery, "ordering" | "sortDir">): SQL {
    const filterSQls: SQL[] = [];

    if (roomId) {
      filterSQls.push(sql`${classrooms.roomId} = ${roomId}`);
    }
    if (gradeLevel) {
      filterSQls.push(sql`${classrooms.gradeLevel} = ${gradeLevel}`);
    }
    if (section) {
      filterSQls.push(sql`${classrooms.section} = ${section}`);
    }
    if (year) {
      filterSQls.push(sql`${classrooms.year} = ${year}`);
    }

    return sql.join(filterSQls, sql` and `);
  }
}
