import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import { classrooms, rooms, users } from "./drizzle/schema";
import {
  length,
  maxLength,
  merge,
  minLength,
  minValue,
  number,
  object,
  omit,
  partial,
  regex,
  string,
} from "valibot";

export const insertRoomSchema = createInsertSchema(rooms, {
  capacity: () => number([minValue(1)]),
});
export const updateRoomSchema = omit(insertRoomSchema, [
  "roomNumber",
  "createdAt",
  "id",
]);
export const selectRoomSchema = createSelectSchema(rooms);

export const insertClassroomSchema = createInsertSchema(classrooms);
export const updateClassroomSchema = omit(insertClassroomSchema, [
  "createdAt",
  "id",
]);
export const patchClassroomSchema = partial(updateClassroomSchema);

const basicInsertSchema = omit(
  createInsertSchema(users, {
    code: () => string([length(6, "Code must be 6 characters")]),
  }),
  ["passwordHash"]
);
export const insertUserSchema = merge([
  basicInsertSchema,
  object({
    password: string([
      minLength(8, "Your password is to short."),
      maxLength(20, "Your password is too long"),
      regex(/[a-z]/, "Your password must contain a lowercase letter."),
      regex(/[A-Z]/, "Your password must contain a uppercase letter."),
      regex(/[0-9]/, "Your password must contain a number."),
    ]),
  }),
]);

export const updateUserSchema = omit(basicInsertSchema, ["id", "createdAt"]);
export const patchUserSchema = partial(updateUserSchema);
