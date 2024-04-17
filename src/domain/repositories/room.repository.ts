import type { QueryParams } from "../../types";
import type { CreateRoomDTO } from "../dtos/room";
import type { ListResponseEntity, RoomEntity } from "../entities";

export abstract class RoomRepository {
  abstract getRooms(
    query: QueryParams
  ): Promise<ListResponseEntity<RoomEntity>>;
  abstract getRoom(id: RoomEntity["id"]): Promise<RoomEntity>;
  abstract createRoom(createRoomDTO: CreateRoomDTO): Promise<RoomEntity>;
}
