import type { RoomDatasource } from "../../domain/datasources";
import type { CreateRoomDTO, UpdateRoomDTO } from "../../domain/dtos/room";
import type { ListResponseEntity, RoomEntity } from "../../domain/entities";
import type { RoomRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class RoomRepositoryImpl implements RoomRepository {
  constructor(private readonly roomDatasource: RoomDatasource) {}

  getRooms(query: QueryParams): Promise<ListResponseEntity<RoomEntity>> {
    return this.roomDatasource.getRooms(query);
  }

  getRoom(id: RoomEntity["id"]): Promise<RoomEntity> {
    return this.roomDatasource.getRoom(id);
  }

  createRoom(createRoomDTO: CreateRoomDTO): Promise<RoomEntity> {
    return this.roomDatasource.createRoom(createRoomDTO);
  }

  updateRoom(id: number, updateRoomDTO: UpdateRoomDTO): Promise<RoomEntity> {
    return this.roomDatasource.updateRoom(id, updateRoomDTO);
  }

  deleteRoom(id: number): Promise<void> {
    return this.roomDatasource.deleteRoom(id);
  }
}
