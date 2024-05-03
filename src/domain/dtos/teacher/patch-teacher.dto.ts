import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchTeacherSchema } from "../../../db/validation-schemas";

export class PatchTeacherDTO {
  private constructor(
    public userId?: string,
    public department?: string | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchTeacherDTO> {
    const result = safeParse(patchTeacherSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { department, userId } = result.output;
      return [undefined, new PatchTeacherDTO(userId, department)];
    }

    const issues = flatten<typeof patchTeacherSchema>(result.issues);
    const errors: Record<string, string[]> = { ...issues.nested };
    if (issues.root) errors.body = issues.root;

    return [errors];
  }
}
