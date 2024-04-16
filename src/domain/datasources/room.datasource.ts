import type { QueryParams } from "../../types";
import type { ListResponseEntity, RoomEntity } from "../entities";
import type { RoomQuery } from "../types";

export abstract class RoomDatasource {
  abstract getRooms(
    query: QueryParams
  ): Promise<ListResponseEntity<RoomEntity>>;
  abstract count(query: RoomQuery): Promise<number>;
  abstract getRoom(id: RoomEntity["id"]): Promise<RoomEntity>;
}
