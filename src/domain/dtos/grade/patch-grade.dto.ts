import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchGradeSchema } from "../../../db/validation-schemas";

export class PatchGradeDTO {
  private constructor(
    public grade?: number | null,
    public studentId?: string,
    public assignmentId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchGradeDTO> {
    const result = safeParse(patchGradeSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { assignmentId, grade, studentId } = result.output;

      return [undefined, new PatchGradeDTO(grade, studentId, assignmentId)];
    }

    const issues = flatten<typeof patchGradeSchema>(result.issues);
    const errors: Record<string, string[]> = { ...issues.nested };
    if (issues.root) errors.body = issues.root;

    return [errors];
  }
}
