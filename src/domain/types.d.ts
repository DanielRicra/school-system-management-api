import type { Classroom, Room, User } from "../db";

type SortDir = "asc" | "desc";

export type RoomQuery = {
  ordering?: keyof Room;
  sortDir: SortDir;
  capacityGte?: number;
  capacityLte?: number;
  roomNumber?: string;
};

export type ClassroomQuery = {
  ordering?: keyof Classroom;
  sortDir: SortDir;
} & Partial<Omit<Classroom, "id" | "createdAt" | "updatedAt">>;

export type DTOCreateResult<T> = [(string | { [key: string]: string })?, T?];

export type UserQuery = {
  ordering?: keyof User;
  sortDir: SortDir;
  role?: User["role"];
  gender?: string;
  deletedAt?: Date | null;
};
