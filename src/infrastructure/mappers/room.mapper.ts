import type { Room } from "../../db";
import { ListResponseEntity, RoomEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { RoomQuery } from "../../domain/types";

export class RoomMapper {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  static roomEntityFromObject(object: { [key: string]: any }) {
    const { id, roomNumber, capacity, createdAt, updatedAt } = object;
    if (!id) throw CustomError.badRequest("Missing id");
    if (!roomNumber) throw CustomError.badRequest("Missing roomNumber");
    if (!createdAt) throw CustomError.badRequest("Missing createdAt");
    if (!updatedAt) throw CustomError.badRequest("Missing updatedAt");

    return new RoomEntity(id, roomNumber, capacity, createdAt, updatedAt);
  }

  static roomQueryFromQueryParams(query: { [key: string]: string }): RoomQuery {
    const { room_number, capacity, ordering } = query;

    const sortField = ordering?.startsWith("-") ? ordering.slice(1) : ordering;

    return {
      roomNumber: room_number,
      capacity: +capacity,
      ordering: sortField as RoomQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
    };
  }

  static listResponseFromEntities(
    data: { count: number; limit: number; offset: number },
    rooms: RoomEntity[]
  ): ListResponseEntity<RoomEntity> {
    const page = data.offset / data.limit + 1;
    const lastPage = data.count === 0 ? 1 : Math.ceil(data.count / data.limit);
    const next = page < lastPage ? `/api/v1/room?page=${page + 1}` : null;
    const previous =
      page > 1 && data.count !== 0
        ? `/api/v1/room?page=${page < lastPage ? page - 1 : lastPage}`
        : null;

    return new ListResponseEntity<RoomEntity>(
      {
        count: data.count,
        page,
        perPage: data.limit,
        lastPage,
        next,
        previous,
      },
      rooms
    );
  }

  static toRoomEntity(room: Room) {
    return new RoomEntity(
      room.id,
      room.roomNumber,
      room.capacity,
      room.createdAt,
      room.updatedAt
    );
  }
}
