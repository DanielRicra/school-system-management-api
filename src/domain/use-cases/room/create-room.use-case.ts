import type { CreateRoomDTO } from "../../dtos/room";
import type { RoomEntity } from "../../entities";
import type { RoomRepository } from "../../repositories";

interface CreateRoomUseCase {
  execute(createRoomDTO: CreateRoomDTO): Promise<RoomEntity>;
}

export class CreateRoom implements CreateRoomUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(createRoomDTO: CreateRoomDTO): Promise<RoomEntity> {
    return await this.roomRepository.createRoom(createRoomDTO);
  }
}
