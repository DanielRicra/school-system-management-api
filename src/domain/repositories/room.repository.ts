import type { QueryParams } from "../../types";
import type { CreateRoomDTO, UpdateRoomDTO } from "../dtos/room";
import type { ListResponseEntity, RoomEntity } from "../entities";

export abstract class RoomRepository {
  abstract getRooms(
    query: QueryParams
  ): Promise<ListResponseEntity<RoomEntity>>;
  abstract getRoom(id: RoomEntity["id"]): Promise<RoomEntity>;
  abstract createRoom(createRoomDTO: CreateRoomDTO): Promise<RoomEntity>;
  abstract updateRoom(
    id: RoomEntity["id"],
    updateRoomDTO: UpdateRoomDTO
  ): Promise<RoomEntity>;
  abstract deleteRoom(id: RoomEntity["id"]): Promise<void>;
}
