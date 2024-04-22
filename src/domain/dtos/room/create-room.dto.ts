import { safeParse } from "valibot";
import { insertRoomSchema } from "../../../db/validation-schemas";
import { mapErrorsMessages } from "../utils";

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

    const errorsObj = mapErrorsMessages(result.issues);

    return [errorsObj];
  }
}
