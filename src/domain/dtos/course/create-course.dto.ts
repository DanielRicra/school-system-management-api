import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { insertCourseSchema } from "../../../db/validation-schemas";

export class CreateCourseDTO {
  private constructor(
    public code: string,
    public name: string,
    public classroomId?: number | null,
    public teacherId?: string | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateCourseDTO> {
    const result = safeParse(insertCourseSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { code, name, classroomId, teacherId } = result.output;
      return [
        undefined,
        new CreateCourseDTO(code, name, classroomId, teacherId),
      ];
    }

    const issues = flatten<typeof insertCourseSchema>(result.issues);
    return [issues.nested];
  }
}
