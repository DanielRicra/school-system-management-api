import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchCourseSchema } from "../../../db/validation-schemas";

export class PatchCourseDTO {
  private constructor(
    public code?: string,
    public name?: string,
    public classroomId?: number | null,
    public teacherId?: string | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchCourseDTO> {
    const result = safeParse(patchCourseSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { classroomId, code, name, teacherId } = result.output;
      return [
        undefined,
        new PatchCourseDTO(code, name, classroomId, teacherId),
      ];
    }

    const issues = flatten<typeof patchCourseSchema>(result.issues);
    const errors: Record<string, string[]> = { ...issues.nested };
    if (issues.root) errors.body = issues.root;

    return [errors];
  }
}
