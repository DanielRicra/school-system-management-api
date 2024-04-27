import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchUserSchema } from "../../../db/validation-schemas";

export class PatchUserDTO {
  private constructor(
    public code?: string,
    public firstName?: string,
    public surname?: string,
    public role?: "admin" | "student" | "teacher",
    public gender?: string | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchUserDTO> {
    const result = safeParse(patchUserSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { code, firstName, role, surname, gender } = result.output;
      return [
        undefined,
        new PatchUserDTO(code, firstName, surname, role, gender),
      ];
    }
    const issues = flatten<typeof patchUserSchema>(result.issues);
    return [issues.nested];
  }
}
