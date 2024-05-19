import type { Student } from "../../db";
import { StudentEntity, type UserEntity } from "../../domain/entities";
import type { StudentQuery } from "../../domain/types";
import { checkEnrollmentStatus, checkGradeLevel } from "../utils/helper";

export class StudentMapper {
  static toStudentEntity(
    student: { user?: UserEntity } & Student
  ): StudentEntity {
    return new StudentEntity(
      student.id,
      student.gradeLevel,
      student.classroomId,
      student.userId,
      student.enrollmentStatus,
      student.createdAt,
      student.updatedAt,
      student.user ?? undefined
    );
  }

  static studentQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): StudentQuery {
    const { ordering, classroom_id, enrollment_status, grade_level } = query;
    const gradeLevel = checkGradeLevel(grade_level);
    const enrollmentStatus = checkEnrollmentStatus(enrollment_status);

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !StudentEntity.getSortingFields().includes(sortField)) {
      sortField = undefined;
    }

    if (sortField?.startsWith("user.")) sortField = sortField.split(".")[1];

    return {
      ordering: sortField as StudentQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      classroomId: Number(classroom_id),
      enrollmentStatus: enrollmentStatus,
      gradeLevel: gradeLevel,
    };
  }
}
