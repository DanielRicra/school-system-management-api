import type { UserDatasource } from "../../domain/datasources";
import type { ListResponseEntity, UserEntity } from "../../domain/entities";
import type { UserRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDatasource: UserDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<UserEntity>> {
    return this.userDatasource.findAll(query);
  }

  findOne(id: UserEntity["id"]): Promise<UserEntity> {
    return this.userDatasource.findOne(id);
  }
}
