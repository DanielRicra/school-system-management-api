import type { Room } from "../../db";
import { RoomEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { RoomQuery } from "../../domain/types";

export class RoomMapper {
  static roomQueryFromQueryParams(query: { [key: string]: string }): RoomQuery {
    const {
      room_number,
      ordering,
      "capacity.gte": capacityGteQ,
      "capacity.lte": capacityLteQ,
    } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    let capacityGte: number | undefined = +capacityGteQ;
    let capacityLte: number | undefined = +capacityLteQ;

    if (capacityGte > capacityLte) {
      throw CustomError.badRequest(
        `Invalid capacity range, '${capacityGte} > ${capacityLte}'`
      );
    }

    capacityGte = capacityGte > 0 ? capacityGte : undefined;
    capacityLte = capacityLte > 0 ? capacityLte : undefined;

    if (sortField && !RoomEntity.getSortingFields().includes(sortField)) {
      sortField = undefined;
    }

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
