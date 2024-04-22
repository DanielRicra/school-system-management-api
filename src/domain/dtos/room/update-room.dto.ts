import { safeParse } from "valibot";
import { updateRoomSchema } from "../../../db/validation-schemas";
import { mapErrorsMessages } from "../utils";

export class UpdateRoomDTO {
  private constructor(public capacity?: number | null) {}

  static create(object: { [key: string]: unknown }): [
    (string | { [key: string]: string })?,
    UpdateRoomDTO?,
  ] {
    const result = safeParse(updateRoomSchema, object);
    if (result.success) {
      const { capacity } = result.output;
      return [undefined, new UpdateRoomDTO(capacity)];
    }

    const errorsObj = mapErrorsMessages(result.issues);

    return [errorsObj];
  }
}
