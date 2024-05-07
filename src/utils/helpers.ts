import { is, isoDate, string, uuid } from "valibot";
import { CustomError } from "../domain/errors";

export function isUUIDFormat(word: string) {
  const userIdSchema = string([uuid()]);

  if (is(userIdSchema, word)) {
    return true;
  }

  return false;
}

export function isValidDate(date: string) {
  if (is(string([isoDate()]), date)) {
    return date;
  }
  throw CustomError.badRequest("Invalid day_date query, must be 'yyyy-mm-dd'.")
}
