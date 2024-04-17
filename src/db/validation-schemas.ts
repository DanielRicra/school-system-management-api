import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import { rooms } from "./drizzle/schema";

export const insertRoomSchema = createInsertSchema(rooms);
export const selectRoomSchema = createSelectSchema(rooms);
