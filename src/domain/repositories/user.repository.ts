import type { QueryParams } from "../../types";
import type {
  CreateUserDTO,
  PatchUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from "../dtos/user";
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
  abstract updatePassword(
    id: UserEntity["id"],
    updatePasswordDTO: UpdatePasswordDTO
  ): Promise<{ updatedId: UserEntity["id"] }>;
  abstract patch(
    id: UserEntity["id"],
    patchUserDTO: PatchUserDTO
  ): Promise<UserEntity>;
  abstract findUsersWithoutStudent(query: { fullName?: string }): Promise<
    (Pick<UserEntity, "id"> & { fullName: string })[]
  >;
}
