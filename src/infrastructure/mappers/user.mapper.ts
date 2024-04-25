import type { User } from "../../db";
import { UserEntity } from "../../domain/entities";
import type { UserQuery } from "../../domain/types";

export class UserMapper {
  static toUserEntity(user: User) {
    const { id, code, firstName, surname, role, gender, createdAt, updatedAt } =
      user;

    return new UserEntity(
      id,
      code,
      firstName,
      surname,
      role,
      gender,
      createdAt,
      updatedAt
    );
  }

  static userQueryFromQueryParams(query: { [key: string]: string; }): UserQuery {
    const { ordering, role, gender } = query;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField === "created_at") sortField = "createdAt";
    if (sortField === "updated_at") sortField = "updatedAt";

    if (!UserEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    return {
      ordering: sortField as UserQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      role: role,
      gender
    };
  }
}
