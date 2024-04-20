import type { Classroom } from "../../db";
import { ClassroomEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { ClassroomQuery } from "../../domain/types";

export class ClassroomMapper {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  static classroomEntityFromObject(object: { [key: string]: any }) {
    const { id, gradeLevel, year, section, roomId, createdAt, updatedAt } =
      object;
    if (!id) throw CustomError.badRequest("Missing id");
    if (!gradeLevel) throw CustomError.badRequest("Missing gradeLevel");
    if (!year) throw CustomError.badRequest("Missing year");
    if (!section) throw CustomError.badRequest("Missing section");
    if (!createdAt) throw CustomError.badRequest("Missing createdAt");
    if (!updatedAt) throw CustomError.badRequest("Missing updatedAt");
    return new ClassroomEntity(
      id,
      gradeLevel,
      year,
      section,
      roomId,
      createdAt,
      updatedAt
    );
  }

  static classroomQueryFromQueryParams(query: {
    [key: string]: string;
  }): ClassroomQuery {
    const { ordering, room_id, section, year, grade_level } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;
    if (sortField === "grade_level") sortField = "gradeLevel";
    if (sortField === "created_at") sortField = "createdAt";
    if (sortField === "updated_at") sortField = "updatedAt";

    if (!ClassroomEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as ClassroomQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      roomId: +room_id,
      section,
      year,
      gradeLevel: grade_level as ClassroomQuery["gradeLevel"],
    };
  }

  static toClassroomEntity(entity: Classroom) {
    return new ClassroomEntity(
      entity.id,
      entity.gradeLevel,
      entity.year,
      entity.section,
      entity.roomId,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
