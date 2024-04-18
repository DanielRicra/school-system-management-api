import type { Room } from "../db";

export type RoomQuery = {
  ordering?: keyof Room;
  sortDir: "asc" | "desc";
  capacityGte?: number;
  capacityLte?: number;
  roomNumber?: string;
};
