import { type SQL, asc, desc, sql, count, eq } from "drizzle-orm";
import { classrooms, db, rooms } from "../../db";
import type { ClassroomDatasource } from "../../domain/datasources";
import type {
  CreateClassroomDTO,
  PatchClassroomDTO,
  UpdateClassroomDTO,
} from "../../domain/dtos/classroom";
import {
  ListResponseEntity,
  type StudentEntity,
  type ClassroomEntity,
} from "../../domain/entities";
import type { ClassroomQuery } from "../../domain/types";
import type { QueryParams } from "../../types";
import {
  ClassroomMapper,
  ListResponseMapper,
  StudentMapper,
  UserMapper,
} from "../mappers";
import { CustomError } from "../../domain/errors";
import { getClassroomById, getStudentsByClassroomId } from "../../db/queries";

type ClassroomQueryFilters = Omit<ClassroomQuery, "ordering" | "sortDir">;

export class ClassroomDatasourceImpl implements ClassroomDatasource {
  async findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<ClassroomEntity>> {
    const { limit, offset, otherParams } = query;
    const { sortDir, gradeLevel, ordering, roomId, section, year } =
      ClassroomMapper.classroomQueryFromQueryParams(otherParams);

    const count = await this.count({
      gradeLevel,
      roomId,
      section,
      year,
    });

    if (count === 0) {
      return new ListResponseEntity();
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
      "classrooms"
    );
  }

  async count(query: ClassroomQueryFilters): Promise<number> {
    let qb = db.select({ count: count() }).from(classrooms).$dynamic();

    if (query.roomId || query.gradeLevel || query.section || query.year) {
      qb = qb.where(this.withFilters(query));
    }

    const response = await qb;
    return response[0].count;
  }

  async findOne(id: ClassroomEntity["id"]): Promise<ClassroomEntity> {
    const classroomResult = await getClassroomById(id);

    if (classroomResult.length === 0) {
      throw CustomError.notFound("Classroom not found");
    }

    return ClassroomMapper.toClassroomEntity(classroomResult[0]);
  }

  async create(
    createClassroomDTO: CreateClassroomDTO
  ): Promise<ClassroomEntity> {
    if (createClassroomDTO.roomId) {
      const roomResult = await db
        .select()
        .from(rooms)
        .where(eq(rooms.id, createClassroomDTO.roomId))
        .limit(1);

      if (!roomResult.length) {
        throw CustomError.badRequest("Creation failed: Room not found");
      }
    }

    const result = await db
      .insert(classrooms)
      .values(createClassroomDTO)
      .returning();

    return ClassroomMapper.toClassroomEntity(result[0]);
  }

  async update(
    id: number,
    updateClassroomDTO: UpdateClassroomDTO
  ): Promise<ClassroomEntity> {
    if (updateClassroomDTO.roomId) {
      const roomResult = await db
        .select()
        .from(rooms)
        .where(eq(rooms.id, updateClassroomDTO.roomId))
        .limit(1);

      if (!roomResult.length) {
        throw CustomError.badRequest("Update failed: Room not found.");
      }
    }

    const result = await db
      .update(classrooms)
      .set(updateClassroomDTO)
      .where(eq(classrooms.id, id))
      .returning();

    if (!result.length) {
      throw CustomError.notFound("Classroom not found.");
    }

    return ClassroomMapper.toClassroomEntity(result[0]);
  }

  async remove(id: ClassroomEntity["id"]): Promise<void> {
    const deletedClassroom = await db
      .delete(classrooms)
      .where(eq(classrooms.id, id))
      .returning({ deletedId: classrooms.id });

    if (!deletedClassroom.length) {
      throw CustomError.notFound(
        `The classroom with id: '${id}' could not be found, failed to delete`
      );
    }
  }

  async patch(
    id: ClassroomEntity["id"],
    patchClassroomDTO: PatchClassroomDTO
  ): Promise<ClassroomEntity> {
    if (patchClassroomDTO.roomId) {
      const roomResult = await db
        .select()
        .from(rooms)
        .where(eq(rooms.id, patchClassroomDTO.roomId));
      if (!roomResult.length) {
        throw CustomError.badRequest("Patch failed: Room not found.");
      }
    }

    const result = await db
      .update(classrooms)
      .set(patchClassroomDTO)
      .where(eq(classrooms.id, id))
      .returning();

    if (!result.length) {
      throw CustomError.notFound("Classroom not found.");
    }

    return ClassroomMapper.toClassroomEntity(result[0]);
  }

  async findClassroomStudents(
    id: ClassroomEntity["id"]
  ): Promise<StudentEntity[]> {
    const existingClassroom = await getClassroomById(id);

    if (!existingClassroom.length) {
      throw CustomError.notFound("Classroom not found");
    }

    const result = await getStudentsByClassroomId(id);
    const entities = result.map((student) => {
      const userEntity = UserMapper.toUserEntity(student.user);
      return StudentMapper.toStudentEntity({ ...student, user: userEntity });
    });
    return entities;
  }

  private withFilters({
    gradeLevel,
    roomId,
    section,
    year,
  }: ClassroomQueryFilters): SQL {
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
