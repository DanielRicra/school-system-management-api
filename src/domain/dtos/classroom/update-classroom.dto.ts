import { flatten, safeParse } from "valibot";
import { updateClassroomSchema } from "../../../db/validation-schemas";
import type { DTOCreateResult } from "../../types";

export class UpdateClassroomDTO {
  private constructor(
    public year: string,
    public section: string,
    public gradeLevel: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public roomId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<UpdateClassroomDTO> {
    const result = safeParse(updateClassroomSchema, object);

    if (result.success) {
      const { gradeLevel, section, year, roomId } = result.output;
      return [
        undefined,
        new UpdateClassroomDTO(year, section, gradeLevel, roomId),
      ];
    }

    const issues = flatten<typeof updateClassroomSchema>(result.issues);

    return [issues.nested];
  }
}
