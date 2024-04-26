import type { UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly userRepository: UserRepository) {}
  execute(id: UserEntity["id"]): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
}
