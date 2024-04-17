import type { UpdateRoomDTO } from "../../dtos/room";
import type { RoomEntity } from "../../entities";
import type { RoomRepository } from "../../repositories";

interface UpdateRoomUseCase {
  execute(
    id: RoomEntity["id"],
    createRoomDTO: UpdateRoomDTO
  ): Promise<RoomEntity>;
}

export class UpdateRoom implements UpdateRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(
    id: RoomEntity["id"],
    updateRoomDTO: UpdateRoomDTO
  ): Promise<RoomEntity> {
    return await this.roomRepository.updateRoom(id, updateRoomDTO);
  }
}
