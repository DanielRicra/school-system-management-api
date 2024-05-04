import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchAssignmentSchema } from "../../../db/validation-schemas";

export class PatchAssignmentDTO {
  private constructor(
    public name?: string,
    public dueDate?: Date | null,
    public courseId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchAssignmentDTO> {
    const result = safeParse(patchAssignmentSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { courseId, dueDate, name } = result.output;

      return [
        undefined,
        new PatchAssignmentDTO(
          name,
          typeof dueDate === "string" ? new Date(dueDate) : dueDate,
          courseId
        ),
      ];
    }

    const issues = flatten<typeof patchAssignmentSchema>(result.issues);
    const errors: Record<string, string[]> = { ...issues.nested };
    if (issues.root) errors.body = issues.root;

    return [errors];
  }
}
