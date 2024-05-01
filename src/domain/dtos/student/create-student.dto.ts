import { flatten, safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { insertStudentSchema } from "../../../db/validation-schemas";

export class CreateStudentDTO {
  private constructor(
    public gradeLevel: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public userId: string,
    public enrollmentStatus:
      | "active"
      | "graduated"
      | "transferred"
      | "inactive",
    public classroomId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateStudentDTO> {
    const result = safeParse(insertStudentSchema, object, {
      abortPipeEarly: true,
    });

    if (result.success) {
      const { gradeLevel, userId, classroomId, enrollmentStatus } =
        result.output;
      return [
        undefined,
        new CreateStudentDTO(
          gradeLevel,
          userId,
          enrollmentStatus ?? "active",
          classroomId
        ),
      ];
    }
    const issues = flatten<typeof insertStudentSchema>(result.issues);
    return [issues.nested];
  }
}
