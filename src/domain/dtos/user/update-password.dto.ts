import { flatten, object, safeParse, string } from "valibot";
import type { DTOCreateResult } from "../../types";
import { userPasswordSchema } from "../../../db/validation-schemas";

export class UpdatePasswordDTO {
  private constructor(
    public password: string,
    public newPassword: string
  ) {}

  static create(obj: {
    [key: string]: unknown;
  }): DTOCreateResult<UpdatePasswordDTO> {
    const passwordsSchema = object({
      password: string(),
      newPassword: userPasswordSchema,
    });

    const result = safeParse(passwordsSchema, obj, { abortPipeEarly: true });

    if (result.success) {
      const { newPassword, password } = result.output;
      return [undefined, new UpdatePasswordDTO(password, newPassword)];
    }

    const issues = flatten<typeof passwordsSchema>(result.issues);
    return [issues.nested];
  }
}
