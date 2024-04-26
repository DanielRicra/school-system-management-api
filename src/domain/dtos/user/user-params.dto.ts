import { uuid, string, is } from "valibot";
import type { DTOCreateResult } from "../../types";

export class UserParamsDTO {
  private constructor(public id: string) {}

  static create(userId: string): DTOCreateResult<UserParamsDTO> {
    const userIdSchema = string([uuid()]);

    if (is(userIdSchema, userId)) {
      return [undefined, new UserParamsDTO(userId)];
    }

    return [{ error: "The id(UUID) is badly formatted." }];
  }
}
