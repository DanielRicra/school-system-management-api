import type { UpdateUserDTO } from "../../dtos/user";
import type { UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class Update {
  constructor(private readonly userRepository: UserRepository) {}

  execute(
    id: UserEntity["id"],
    updateUserDTO: UpdateUserDTO
  ): Promise<UserEntity> {
    return this.userRepository.update(id, updateUserDTO);
  }
}
