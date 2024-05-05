import type { Grade } from "../../db";
import { GradeEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { GradeQuery } from "../../domain/types";
import { isUUIDFormat } from "../../utils/helpers";

export class GradeMapper {
  static toGradeEntity(grade: Grade): GradeEntity {
    return new GradeEntity(
      grade.id,
      grade.grade,
      grade.studentId,
      grade.assignmentId,
      grade.createdAt,
      grade.updatedAt
    );
  }

  static gradeQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): GradeQuery {
    const {
      ordering,
      "grade.lte": gradeLteQ,
      "grade.gte": gradeGteQ,
      student_id: studentId,
      assignment_id,
    } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (studentId && !isUUIDFormat(studentId)) {
      throw CustomError.badRequest(
        "Field 'student_id' uuid is badly formatted."
      );
    }

    let gradeGte: number | undefined = Number(gradeGteQ);
    let gradeLte: number | undefined = Number(gradeLteQ);

    if (gradeGte > gradeLte) {
      throw CustomError.badRequest(
        `Invalid grade range, '${gradeGte} > ${gradeLte}'`
      );
    }

    gradeGte = gradeGte >= 0 ? gradeGte : undefined;
    gradeLte = gradeLte >= 0 ? gradeLte : undefined;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !GradeEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as GradeQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      gradeGte,
      gradeLte,
      studentId,
      assignmentId: Number(assignment_id),
    };
  }
}
