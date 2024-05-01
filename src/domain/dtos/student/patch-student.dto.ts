import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchStudentSchema } from "../../../db/validation-schemas";

export class PatchStudentDTO {
  private constructor(
    public gradeLevel?: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public userId?: string,
    public enrollmentStatus?:
      | "active"
      | "graduated"
      | "transferred"
      | "inactive",
    public classroomId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchStudentDTO> {
    const result = safeParse(patchStudentSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { gradeLevel, userId, classroomId, enrollmentStatus } =
        result.output;
      return [
        undefined,
        new PatchStudentDTO(gradeLevel, userId, enrollmentStatus, classroomId),
      ];
    }
    const issues = flatten<typeof patchStudentSchema>(result.issues);
    const errors: Record<string, string[]> = { ...issues.nested };
    if (issues.root) errors.body = issues.root;

    return [errors];
  }
}
