import { type SQL, sql, count, asc, desc, eq, and, isNull } from "drizzle-orm";
import type { AttendanceDatasource } from "../../domain/datasources";
import type {
  ListResponseEntity,
  AttendanceEntity,
} from "../../domain/entities";
import type { QueryParams } from "../../types";
import { ListResponseMapper, AttendanceMapper } from "../mappers";
import type { AttendanceQuery } from "../../domain/types";
import { db, students, courses, attendance, classrooms } from "../../db";
import { CustomError } from "../../domain/errors";
import type {
  CreateAttendanceDTO,
  PatchAttendanceDTO,
} from "../../domain/dtos/attendance";

type AttendanceQueryFilters = Omit<AttendanceQuery, "sortDir" | "ordering">;

export class AttendanceDatasourceImpl implements AttendanceDatasource {
  async findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<AttendanceEntity>> {
    const { limit, offset, otherParams } = query;
    const {
      sortDir,
      ordering,
      courseId,
      dayDate,
      hourDate,
      status,
      studentId,
    } = AttendanceMapper.attendanceQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({
      courseId,
      dayDate,
      hourDate,
      status,
      studentId,
    });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return ListResponseMapper.listResponseFromEntities(
        { count: 0, limit, offset },
        [],
        "attendance"
      );
    }

    let qb = db.select().from(attendance).$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      order =
        sortDir === "asc"
          ? asc(attendance[ordering])
          : desc(attendance[ordering]);
    } else order = desc(attendance.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const entities = result.map((attendance) =>
      AttendanceMapper.toAttendanceEntity(attendance)
    );

    return ListResponseMapper.listResponseFromEntities(
      { limit, offset, count: countResult },
      entities,
      "attendance"
    );
  }

  async findOne(id: AttendanceEntity["id"]): Promise<AttendanceEntity> {
    const result = await db
      .select()
      .from(attendance)
      .where(eq(attendance.id, id));

    if (!result.length) throw CustomError.notFound("Attendance not found.");

    return AttendanceMapper.toAttendanceEntity(result[0]);
  }

  async create(
    createAttendanceDTO: CreateAttendanceDTO
  ): Promise<AttendanceEntity> {
    const { courseId, studentId } = createAttendanceDTO;

    const studentHasCourse = await db
      .select({ classroomId: classrooms.id })
      .from(classrooms)
      .innerJoin(students, eq(classrooms.id, students.classroomId))
      .innerJoin(courses, eq(classrooms.id, courses.classroomId))
      .where(and(eq(courses.id, courseId), eq(students.id, studentId)));

    if (!studentHasCourse.length) {
      throw CustomError.badRequest(
        `Failed to create attendance for student (ID: ${studentId}). The student may not be enrolled in a classroom offering the course (ID: ${courseId}), or the student or course may not exist.`
      );
    }

    const result = await db
      .insert(attendance)
      .values(createAttendanceDTO)
      .returning();

    return AttendanceMapper.toAttendanceEntity(result[0]);
  }

  async patch(
    id: AttendanceEntity["id"],
    patchAttendanceDTO: PatchAttendanceDTO
  ): Promise<{ attendanceId: AttendanceEntity["id"] }> {
    const { courseId, studentId } = patchAttendanceDTO;
    try {
      const result = await db
        .update(attendance)
        .set(patchAttendanceDTO)
        .where(eq(attendance.id, id))
        .returning({ attendanceId: attendance.id });

      if (!result.length) {
        throw CustomError.notFound("Failed to updated, attendance not found.");
      }

      return result[0];
      // biome-ignore lint/suspicious/noExplicitAny: there was no other way
    } catch (error: any) {
      if (error.code === "23503") {
        let message = "";
        if (courseId && !studentId)
          message = `Course (ID: ${courseId}) not found.`;
        if (!courseId && studentId)
          message = `Student (ID: ${studentId}) not found.`;
        if (courseId && studentId)
          message =
            "Course (ID: ${courseId}) or Student (ID: ${studentId}) not found.";
        throw CustomError.badRequest(message);
      }
      throw error;
    }
  }

  async remove(id: AttendanceEntity["id"]): Promise<void> {
    const result = await db
      .delete(attendance)
      .where(eq(attendance.id, id))
      .returning({ deletedId: attendance.id });

    if (!result.length) {
      throw CustomError.notFound(
        `The attendance (ID: ${id}) could not be found, failed to delete`
      );
    }
  }

  private withFilters({
    courseId,
    dayDate,
    hourDate,
    status,
    studentId,
  }: AttendanceQueryFilters): SQL | undefined {
    const filterSQls: SQL[] = [];
    if (studentId) {
      filterSQls.push(sql`${attendance.studentId} = ${studentId}`);
    }

    if (courseId) {
      filterSQls.push(sql`${attendance.courseId} = ${courseId}`);
    }

    if (status) {
      filterSQls.push(sql`${attendance.status} = ${status}`);
    }

    if (status === null) {
      filterSQls.push(isNull(attendance.status));
    }

    if (dayDate) {
      filterSQls.push(sql`${attendance.date}::date = ${dayDate}`);
    }

    if (hourDate) {
      filterSQls.push(
        sql`date_part('hour', ${attendance.status}) = ${hourDate}`
      );
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db.select({ count: count() }).from(attendance).$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }
}
