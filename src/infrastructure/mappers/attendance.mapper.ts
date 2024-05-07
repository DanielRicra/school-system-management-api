import type { Attendance } from "../../db";
import { AttendanceEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { AttendanceQuery } from "../../domain/types";
import { isUUIDFormat, isValidDate } from "../../utils/helpers";

export class AttendanceMapper {
  static toAttendanceEntity(attendance: Attendance): AttendanceEntity {
    return new AttendanceEntity(
      attendance.id,
      attendance.status,
      attendance.date,
      attendance.courseId,
      attendance.studentId,
      attendance.createdAt,
      attendance.updatedAt
    );
  }

  static attendanceQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): AttendanceQuery {
    const {
      ordering,
      status: statusQuery,
      day_date,
      hour_date,
      student_id: studentId,
      course_id,
    } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    let status: AttendanceQuery["status"] =
      statusQuery === "null" ? null : undefined;
    if (["present", "absent", "late"].includes(statusQuery ?? "-")) {
      status = statusQuery as AttendanceQuery["status"];
    }

    if (studentId && !isUUIDFormat(studentId)) {
      throw CustomError.badRequest(
        "Field 'student_id' uuid is badly formatted."
      );
    }

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !AttendanceEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as AttendanceQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      studentId,
      courseId: Number(course_id),
      dayDate: day_date ? isValidDate(day_date) : undefined,
      hourDate: Number(hour_date),
      status: status as AttendanceQuery["status"],
    };
  }
}
