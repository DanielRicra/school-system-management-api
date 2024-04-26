import type { QueryParams } from "../../types";
import type { ListResponseEntity, UserEntity } from "../entities";

export abstract class UserRepository {
  abstract findAll(query: QueryParams): Promise<ListResponseEntity<UserEntity>>;
  abstract findOne(id: UserEntity["id"]): Promise<UserEntity>;
}
