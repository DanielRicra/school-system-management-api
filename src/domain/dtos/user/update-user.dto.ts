import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { updateUserSchema } from "../../../db/validation-schemas";

export class UpdateUserDTO {
  private constructor(
    public code: string,
    public firstName: string,
    public surname: string,
    public role: "admin" | "student" | "teacher",
    public gender?: string | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<UpdateUserDTO> {
    const result = safeParse(updateUserSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { code, firstName, role, surname, gender } = result.output;
      return [
        undefined,
        new UpdateUserDTO(code, firstName, surname, role, gender),
      ];
    }
    const issues = flatten<typeof updateUserSchema>(result.issues);
    return [issues.nested];
  }
}
