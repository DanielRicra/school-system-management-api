import type { Course } from "../../db";
import { CourseEntity } from "../../domain/entities";
import type { CourseQuery } from "../../domain/types";

export class CourseMapper {
  static toCourseEntity(course: Course): CourseEntity {
    return new CourseEntity(
      course.id,
      course.code,
      course.name,
      course.classroomId,
      course.teacherId,
      course.createdAt,
      course.updatedAt
    );
  }

  static courseQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): CourseQuery {
    const { ordering, classroom_id, teacher_id: teacherId } = query;
    let classroomId: null | undefined | number =
      classroom_id === "null" ? null : Number(classroom_id);
    if (Number.isNaN(classroomId)) classroomId = undefined;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !CourseEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as CourseQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      classroomId,
      teacherId,
    };
  }
}
