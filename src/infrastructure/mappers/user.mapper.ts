import type { Teacher, User } from "../../db";
import { UserEntity } from "../../domain/entities";
import type { UserQuery } from "../../domain/types";

export class UserMapper {
  static toUserEntity(user: User) {
    const {
      id,
      code,
      firstName,
      surname,
      role,
      gender,
      createdAt,
      updatedAt,
      deletedAt,
    } = user;

    return new UserEntity(
      id,
      code,
      firstName,
      surname,
      role,
      gender,
      deletedAt,
      createdAt,
      updatedAt
    );
  }

  static basicUser(user: Pick<User, "id"> & { fullName: string }) {
    return {
      id: user.id,
      fullName: user.fullName,
    };
  }

  static userQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): UserQuery {
    const { ordering, role, gender, first_name, surname } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !UserEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as UserQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      role: role as User["role"],
      gender,
      firstName: first_name?.trim(),
      surname: surname?.trim(),
    };
  }
}
