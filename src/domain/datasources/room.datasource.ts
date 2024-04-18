import type { QueryParams } from "../../types";
import type { CreateRoomDTO, UpdateRoomDTO } from "../dtos/room";
import type { ListResponseEntity, RoomEntity } from "../entities";
import type { RoomQuery } from "../types";

export abstract class RoomDatasource {
  abstract getRooms(
    query: QueryParams
  ): Promise<ListResponseEntity<RoomEntity>>;
  abstract count(query: RoomQuery): Promise<number>;
  abstract getRoom(id: RoomEntity["id"]): Promise<RoomEntity>;
  abstract createRoom(createRoomDTO: CreateRoomDTO): Promise<RoomEntity>;
  abstract updateRoom(
    id: RoomEntity["id"],
    updateRoomDTO: UpdateRoomDTO
  ): Promise<RoomEntity>;
  abstract deleteRoom(id: RoomEntity["id"]): Promise<void>;
}
