import type { UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class FindUsersWithoutTeacher {
  constructor(private readonly userRepository: UserRepository) {}

  execute(query: { fullName?: string }): Promise<
    (Pick<UserEntity, "id"> & { fullName: string })[]
  > {
    return this.userRepository.findUsersWithoutTeacher(query);
  }
}
