import type { UpdatePasswordDTO } from "../../dtos/user";
import type { UserRepository } from "../../repositories";

export class UpdatePassword {
  constructor(private readonly userRepository: UserRepository) {}

  execute(
    id: string,
    updatePasswordDTO: UpdatePasswordDTO
  ): Promise<{ updatedId: string }> {
    return this.userRepository.updatePassword(id, updatePasswordDTO);
  }
}
