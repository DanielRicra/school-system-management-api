import type { Room } from "../db";

export type RoomQuery = {
  ordering?: keyof Room;
  sortDir: "asc" | "desc";
} & Partial<Omit<Room, "createdAt" | "updatedAt" | "id">>;
