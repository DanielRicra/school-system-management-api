import { safeParse } from "valibot";
import type { DTOCreateResult } from "../../types";
import { patchClassroomSchema } from "../../../db/validation-schemas";
import { mapErrorsMessages } from "../utils";

export class PatchClassroomDTO {
  private constructor(
    public year?: string,
    public section?: string,
    public gradeLevel?: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public roomId?: number | null
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<PatchClassroomDTO> {
    const result = safeParse(patchClassroomSchema, object);

    if (result.success) {
      if (!Object.entries(result.output).length) {
        return [{ error: "Patch body can't be empty or incorrect key." }];
      }

      const { gradeLevel, roomId, section, year } = result.output;

      return [
        undefined,
        new PatchClassroomDTO(year, section, gradeLevel, roomId),
      ];
    }

    const errorsObj = mapErrorsMessages(result.issues);

    return [errorsObj];
  }
}
