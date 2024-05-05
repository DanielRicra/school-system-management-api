import type { Room } from "../../db";
import { RoomEntity } from "../../domain/entities";
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
    const {
      room_number,
      ordering,
      "capacity.gte": capacityGteQ,
      "capacity.lte": capacityLteQ,
    } = query;

    const sortField = ordering?.startsWith("-") ? ordering.slice(1) : ordering;
    let capacityGte: number | undefined = +capacityGteQ;
    let capacityLte: number | undefined = +capacityLteQ;

    if (capacityGte > capacityLte) {
      throw CustomError.badRequest(
        `Invalid capacity range, '${capacityGte} > ${capacityLte}'`
      );
    }

    capacityGte = capacityGte > 0 ? capacityGte : undefined;
    capacityLte = capacityLte > 0 ? capacityLte : undefined;

    return {
      roomNumber: room_number,
      ordering: sortField as RoomQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      capacityGte,
      capacityLte,
    };
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
