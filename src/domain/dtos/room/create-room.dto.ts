import { safeParse } from "valibot";
import { insertRoomSchema } from "../../../db/validation-schemas";

export class CreateRoomDTO {
  private constructor(
    public roomNumber: string,
    public capacity?: number | null
  ) {}

  static create(object: { [key: string]: unknown }): [
    (string | { [key: string]: string })?,
    CreateRoomDTO?,
  ] {
    const result = safeParse(insertRoomSchema, object);
    if (result.success) {
      const { roomNumber, capacity } = result.output;
      return [undefined, new CreateRoomDTO(roomNumber, capacity)];
    }

    const errors: { [key: string]: string } = {};
    for (const issue of result.issues) {
      const key = issue.path?.[0].key as string;
      errors[key] = issue.message;
    }

    return [errors, undefined];
  }
}
