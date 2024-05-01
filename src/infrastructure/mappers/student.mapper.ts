import type { Student } from "../../db";
import { StudentEntity } from "../../domain/entities";
import type { StudentQuery } from "../../domain/types";

export class StudentMapper {
  static toStudentEntity(student: Student): StudentEntity {
    return new StudentEntity(
      student.id,
      student.gradeLevel,
      student.classroomId,
      student.userId,
      student.enrollmentStatus,
      student.createdAt,
      student.updatedAt
    );
  }

  static studentQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): StudentQuery {
    const { ordering, classroom_id, enrollment_status, grade_level } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !StudentEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as StudentQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      classroomId: Number(classroom_id),
      enrollmentStatus: enrollment_status as StudentQuery["enrollmentStatus"],
      gradeLevel: grade_level as StudentQuery["gradeLevel"],
    };
  }
}
