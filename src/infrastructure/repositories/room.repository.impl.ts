import type { RoomDatasource } from "../../domain/datasources";
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
}
