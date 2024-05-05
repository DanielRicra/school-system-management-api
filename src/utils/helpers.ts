import { is, string, uuid } from "valibot";

export function isUUIDFormat(word: string) {
  const userIdSchema = string([uuid()]);

  if (is(userIdSchema, word)) {
    return true;
  }

  return false;
}
