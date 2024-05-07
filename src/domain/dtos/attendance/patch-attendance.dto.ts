import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchAttendanceSchema } from "../../../db/validation-schemas";

export class PatchAttendanceDTO {
  private constructor(
    public status?: "absent" | "present" | "late" | null,
    public date?: Date | null,
    public courseId?: number,
    public studentId?: string
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchAttendanceDTO> {
    const result = safeParse(patchAttendanceSchema, object);

    if (result.success) {
      const { status, courseId, date, studentId } = result.output;

      return [
        undefined,
        new PatchAttendanceDTO(status, date, courseId, studentId),
      ];
    }

    const issues = flatten<typeof patchAttendanceSchema>(result.issues);
    const errors: Record<string, string[]> = { ...issues.nested };
    if (issues.root) errors.body = issues.root;

    return [errors];
  }
}
