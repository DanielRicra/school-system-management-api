import type { UserDatasource } from "../../domain/datasources";
import type {
  CreateUserDTO,
  PatchUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from "../../domain/dtos/user";
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

  create(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    return this.userDatasource.create(createUserDTO);
  }

  update(
    id: UserEntity["id"],
    updateUserDTO: UpdateUserDTO
  ): Promise<UserEntity> {
    return this.userDatasource.update(id, updateUserDTO);
  }

  remove(id: UserEntity["id"]): Promise<void> {
    return this.userDatasource.remove(id);
  }

  updatePassword(
    id: string,
    updatePasswordDTO: UpdatePasswordDTO
  ): Promise<{ updatedId: string }> {
    return this.userDatasource.updatePassword(id, updatePasswordDTO);
  }

  patch(id: string, patchUserDTO: PatchUserDTO): Promise<UserEntity> {
    return this.userDatasource.patch(id, patchUserDTO);
  }
}
