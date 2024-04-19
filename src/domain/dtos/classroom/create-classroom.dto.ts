import { safeParse } from "valibot";
import { insertClassroomSchema } from "../../../db/validation-schemas";
import type { DTOCreateResult } from "../../types";

export class CreateClassroomDTO {
  private constructor(
    public year: string,
    public section: string,
    public gradeLevel: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public roomId?: number | null,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date
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

    const errors: { [key: string]: string } = {};
    for (const issue of result.issues) {
      const key = issue.path?.[0].key as string;
      errors[key] = issue.message;
    }

    return [errors];
  }
}
