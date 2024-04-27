import type { UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class Remove {
  constructor(private readonly userRepository: UserRepository) {}

  execute(id: UserEntity["id"]): Promise<void> {
    return this.userRepository.remove(id);
  }
}
