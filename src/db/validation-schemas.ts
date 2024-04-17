import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import { rooms } from "./drizzle/schema";
import { minValue, number } from "valibot";

export const insertRoomSchema = createInsertSchema(rooms, {
  capacity: () => number([minValue(1)]),
});
export const selectRoomSchema = createSelectSchema(rooms);
