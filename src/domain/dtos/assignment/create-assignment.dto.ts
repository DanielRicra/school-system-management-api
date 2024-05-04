import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { insertAssignmentSchema } from "../../../db/validation-schemas";

export class CreateAssignmentDTO {
  private constructor(
    public name: string,
    public dueDate?: Date | null,
    public courseId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateAssignmentDTO> {
    const result = safeParse(insertAssignmentSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { name, courseId, dueDate } = result.output;
      return [
        undefined,
        new CreateAssignmentDTO(
          name,
          typeof dueDate === "string" ? new Date(dueDate) : dueDate,
          courseId
        ),
      ];
    }

    const issues = flatten<typeof insertAssignmentSchema>(result.issues);
    return [issues.nested];
  }
}
