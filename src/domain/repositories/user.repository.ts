import type { QueryParams } from "../../types";
import type { CreateUserDTO, UpdateUserDTO } from "../dtos/user";
import type { ListResponseEntity, UserEntity } from "../entities";

export abstract class UserRepository {
  abstract findAll(query: QueryParams): Promise<ListResponseEntity<UserEntity>>;
  abstract findOne(id: UserEntity["id"]): Promise<UserEntity>;
  abstract create(createUserDTO: CreateUserDTO): Promise<UserEntity>;
  abstract update(
    id: UserEntity["id"],
    updateUserDTO: UpdateUserDTO
  ): Promise<UserEntity>;
  abstract remove(id: UserEntity["id"]): Promise<void>;
}
