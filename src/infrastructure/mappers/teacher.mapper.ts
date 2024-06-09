import type { Teacher } from "../../db";
import { TeacherEntity, type UserEntity } from "../../domain/entities";
import type { TeacherQuery } from "../../domain/types";

export class TeacherMapper {
  static toTeacherEntity(
    teacher: Teacher & { user?: UserEntity }
  ): TeacherEntity {
    return new TeacherEntity(
      teacher.id,
      teacher.department,
      teacher.userId,
      teacher.createdAt,
      teacher.updatedAt,
      teacher.user
    );
  }

  static teacherQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): TeacherQuery {
    const { ordering, department, first_name: firstName, surname } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !TeacherEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as TeacherQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      department,
      firstName,
      surname,
    };
  }
}
