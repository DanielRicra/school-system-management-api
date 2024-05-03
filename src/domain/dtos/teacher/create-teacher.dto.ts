import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { insertTeacherSchema } from "../../../db/validation-schemas";

export class CreateTeacherDTO {
  private constructor(
    public userId: string,
    public department?: string | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateTeacherDTO> {
    const result = safeParse(insertTeacherSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { userId, department } = result.output;
      return [undefined, new CreateTeacherDTO(userId, department)];
    }

    const issues = flatten<typeof insertTeacherSchema>(result.issues);
    return [issues.nested];
  }
}
