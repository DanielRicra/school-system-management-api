import type { PatchUserDTO } from "../../dtos/user";
import type { UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class Patch {
  constructor(private readonly userRepository: UserRepository) {}

  execute(
    id: UserEntity["id"],
    patchUserDTO: PatchUserDTO
  ): Promise<UserEntity> {
    return this.userRepository.patch(id, patchUserDTO);
  }
}
