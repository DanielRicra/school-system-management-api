import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { insertGradeSchema } from "../../../db/validation-schemas";

export class CreateGradeDTO {
  private constructor(
    public grade?: number | null,
    public studentId?: string | null,
    public assignmentId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateGradeDTO> {
    const result = safeParse(insertGradeSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { assignmentId, grade, studentId } = result.output;
      return [undefined, new CreateGradeDTO(grade, studentId, assignmentId)];
    }

    const issues = flatten<typeof insertGradeSchema>(result.issues);
    return [issues.nested];
  }
}
