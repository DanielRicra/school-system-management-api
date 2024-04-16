import type { QueryParams } from "../../../types";
import type { ListResponseEntity, RoomEntity } from "../../entities";
import type { RoomRepository } from "../../repositories";

interface GetRoomsUseCase {
  execute(query: QueryParams): Promise<ListResponseEntity<RoomEntity>>;
}

export class GetRooms implements GetRoomsUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(query: QueryParams): Promise<ListResponseEntity<RoomEntity>> {
    return await this.roomRepository.getRooms(query);
  }
}
