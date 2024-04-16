import type { QueryParams } from "../../types";
import type { ListResponseEntity, RoomEntity } from "../entities";

export abstract class RoomRepository {
  abstract getRooms(
    query: QueryParams
  ): Promise<ListResponseEntity<RoomEntity>>;
  abstract getRoom(id: RoomEntity["id"]): Promise<RoomEntity>;
}
