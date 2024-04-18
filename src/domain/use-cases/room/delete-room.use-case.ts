import type { RoomEntity } from "../../entities";
import type { RoomRepository } from "../../repositories";

interface DeleteRoomUseCase {
  execute(id: RoomEntity["id"]): Promise<void>;
}

export class DeleteRoom implements DeleteRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  execute(id: number): Promise<void> {
    return this.roomRepository.deleteRoom(id);
  }
}
