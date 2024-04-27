import type { CreateUserDTO } from "../../dtos/user/create-user.dto";
import type { UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class Create {
  constructor(private readonly userRepository: UserRepository) {}

  execute(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    return this.userRepository.create(createUserDTO);
  }
}
