import { safeParse } from "valibot";
import { updateRoomSchema } from "../../../db/validation-schemas";

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

    const errors: { [key: string]: string } = {};
    for (const issue of result.issues) {
      const key = issue.path?.[0].key as string;
      errors[key] = issue.message;
    }

    return [errors, undefined];
  }
}
