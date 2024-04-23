import { safeParse } from "valibot";
import { insertClassroomSchema } from "../../../db/validation-schemas";
import type { DTOCreateResult } from "../../types";
import { mapErrorsMessages } from "../utils";

export class CreateClassroomDTO {
  private constructor(
    public year: string,
    public section: string,
    public gradeLevel: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public roomId?: number | null,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: string
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<CreateClassroomDTO> {
    const result = safeParse(insertClassroomSchema, object);

    if (result.success) {
      const { gradeLevel, section, year, roomId } = result.output;
      return [
        undefined,
        new CreateClassroomDTO(year, section, gradeLevel, roomId),
      ];
    }

    const errorsObj = mapErrorsMessages(result.issues);

    return [errorsObj];
  }
}
