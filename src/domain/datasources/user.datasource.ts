import type { QueryParams } from "../../types";
import type { CreateUserDTO } from "../dtos/user/create-user.dto";
import type { ListResponseEntity, UserEntity } from "../entities";

export abstract class UserDatasource {
  abstract findAll(query: QueryParams): Promise<ListResponseEntity<UserEntity>>;
  abstract findOne(id: UserEntity["id"]): Promise<UserEntity>;
  abstract create(createUserDTO: CreateUserDTO): Promise<UserEntity>;
}
