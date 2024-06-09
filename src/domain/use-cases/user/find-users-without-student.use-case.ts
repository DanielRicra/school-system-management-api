import type { UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class FindUsersWithoutStudent {
  constructor(private readonly userRepository: UserRepository) {}

  execute(query: { fullName?: string }): Promise<
    (Pick<UserEntity, "id"> & { fullName: string })[]
  > {
    return this.userRepository.findUsersWithoutStudent(query);
  }
}
