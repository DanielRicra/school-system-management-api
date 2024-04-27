import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { insertUserSchema } from "../../../db/validation-schemas";

export class CreateUserDTO {
  private constructor(
    public code: string,
    public firstName: string,
    public surname: string,
    public password: string,
    public role: "admin" | "student" | "teacher",
    public gender?: string | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateUserDTO> {
    const result = safeParse(insertUserSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { code, firstName, password, role, surname, gender } =
        result.output;
      return [
        undefined,
        new CreateUserDTO(code, firstName, surname, password, role, gender),
      ];
    }
    const issues = flatten<typeof insertUserSchema>(result.issues);
    return [issues.nested];
  }
}
