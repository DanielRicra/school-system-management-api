import type { QueryParams } from "../../../types";
import type { ListResponseEntity, UserEntity } from "../../entities";
import type { UserRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly userRepository: UserRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<UserEntity>> {
    return this.userRepository.findAll(query);
  }
}
