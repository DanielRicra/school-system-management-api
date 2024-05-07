import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { insertAttendanceSchema } from "../../../db/validation-schemas";

export class CreateAttendanceDTO {
  private constructor(
    public courseId: number,
    public studentId: string,
    public status?: "absent" | "present" | "late" | null,
    public date?: Date | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateAttendanceDTO> {
    const result = safeParse(insertAttendanceSchema, object);

    if (result.success) {
      const { courseId, date, status, studentId } = result.output;
      return [
        undefined,
        new CreateAttendanceDTO(courseId, studentId, status, date),
      ];
    }

    const issues = flatten<typeof insertAttendanceSchema>(result.issues);
    return [issues.nested];
  }
}
