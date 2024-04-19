import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import { classrooms, rooms } from "./drizzle/schema";
import { minValue, number, omit } from "valibot";

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
