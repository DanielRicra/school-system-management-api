import type { RoomEntity } from "../../entities";
import type { RoomRepository } from "../../repositories";

interface GetRoomUseCase {
  execute(id: RoomEntity["id"]): Promise<RoomEntity>;
}

export class GetRoom implements GetRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(id: RoomEntity["id"]): Promise<RoomEntity> {
    return await this.roomRepository.getRoom(id);
  }
}
