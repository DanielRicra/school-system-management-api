import {
  type SQL,
  sql,
  count,
  desc,
  asc,
  eq,
  and,
  ne,
  isNull,
  ilike,
} from "drizzle-orm";
import { db, students, users } from "../../db";
import type { UserDatasource } from "../../domain/datasources";
import { ListResponseEntity, type UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { UserQuery } from "../../domain/types";
import type { QueryParams } from "../../types";
import { ListResponseMapper, UserMapper } from "../mappers";
import type {
  CreateUserDTO,
  PatchUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from "../../domain/dtos/user";
import { BcryptAdapter } from "../../config";

type UserQueryFilters = Omit<UserQuery, "sortDir" | "ordering">;
type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class UserDatasourceImpl implements UserDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async findAll(query: QueryParams): Promise<ListResponseEntity<UserEntity>> {
    const { limit, offset, otherParams } = query;
    const { sortDir, gender, ordering, role } =
      UserMapper.userQueryFromQueryParams(otherParams);

    const whereSQL = this.withFilters({ gender, role });

    const countResult = await this.countAll(whereSQL);

    if (countResult === 0) {
      return new ListResponseEntity();
    }

    let qb = db.select().from(users).$dynamic();

    if (whereSQL) {
      qb = qb.where(whereSQL);
    }

    let order: SQL;
    if (ordering) {
      order = sortDir === "asc" ? asc(users[ordering]) : desc(users[ordering]);
    } else order = desc(users.createdAt);

    const result = await qb.limit(limit).offset(offset).orderBy(order);

    const usersEntities = result.map((user) => UserMapper.toUserEntity(user));
    return ListResponseMapper.listResponseFromEntities(
      { limit, offset, count: countResult },
      usersEntities,
      "users"
    );
  }

  private async countAll(whereSql?: SQL): Promise<number> {
    let qb = db.select({ count: count() }).from(users).$dynamic();

    if (whereSql) {
      qb = qb.where(whereSql);
    }

    const result = await qb;
    return result[0].count;
  }

  async findOne(id: UserEntity["id"]): Promise<UserEntity> {
    const result = await db.select().from(users).where(eq(users.id, id));

    if (!result.length) throw CustomError.notFound("User not found.");

    return UserMapper.toUserEntity(result[0]);
  }

  async create(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const { code, password } = createUserDTO;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.code, code));

    if (existingUser.length) {
      throw CustomError.badRequest("Code already taken.");
    }

    const result = await db
      .insert(users)
      .values({ ...createUserDTO, passwordHash: this.hashPassword(password) })
      .returning();

    return UserMapper.toUserEntity(result[0]);
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
    const existingUser = await db
      .select()
      .from(users)
      .where(and(eq(users.code, updateUserDTO.code), ne(users.id, id)));

    if (existingUser.length) {
      throw CustomError.badRequest("Code already taken.");
    }

    const result = await db
      .update(users)
      .set(updateUserDTO)
      .where(eq(users.id, id))
      .returning();

    if (!result.length) {
      throw CustomError.badRequest("User not found.");
    }

    return UserMapper.toUserEntity(result[0]);
  }

  async remove(id: string): Promise<void> {
    // Logic deleted user
    const result = await db
      .update(users)
      .set({ deletedAt: sql`now()` })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning({ userId: users.id });

    if (!result.length) {
      throw CustomError.notFound(
        `The user with id: '${id}' could not be found, failed to delete`
      );
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDTO: UpdatePasswordDTO
  ): Promise<{ updatedId: string }> {
    const { newPassword, password } = updatePasswordDTO;

    const existingUser = await db.select().from(users).where(eq(users.id, id));

    if (!existingUser.length) throw CustomError.notFound("User not found.");

    if (!this.comparePassword(password, existingUser[0].passwordHash)) {
      throw CustomError.unauthorized("Unauthorized request.");
    }

    const userIdResult = await db
      .update(users)
      .set({ passwordHash: this.hashPassword(newPassword) })
      .where(eq(users.id, id))
      .returning({ updatedId: users.id });

    if (!userIdResult.length) {
      throw CustomError.notFound("Failed to update password, user not found.");
    }

    return userIdResult[0];
  }

  async patch(id: string, patchUserDTO: PatchUserDTO): Promise<UserEntity> {
    if (patchUserDTO.code) {
      const existingUser = await db
        .select()
        .from(users)
        .where(and(eq(users.code, patchUserDTO.code), ne(users.id, id)));

      if (existingUser.length) {
        throw CustomError.badRequest("Code already taken.");
      }
    }

    const result = await db
      .update(users)
      .set(patchUserDTO)
      .where(eq(users.id, id))
      .returning();

    if (!result.length) {
      throw CustomError.badRequest("User not found.");
    }

    return UserMapper.toUserEntity(result[0]);
  }

  async findUsersWithoutStudent(query: { fullName?: string }): Promise<
    (Pick<UserEntity, "id"> & { fullName: string })[]
  > {
    const [surname, firstName] = query.fullName?.split(",") ?? [];
    const result = await db
      .select({
        id: users.id,
        fullName: sql<string>`concat(upper(${users.surname}),', ',${users.firstName})`,
      })
      .from(users)
      .leftJoin(students, eq(users.id, students.userId))
      .where(
        and(
          eq(users.role, "student"),
          isNull(students.userId),
          isNull(users.deletedAt),
          surname ? ilike(users.surname, `%${surname}%`) : undefined,
          firstName ? ilike(users.firstName, `%${firstName}%`) : undefined
        )
      );

    const entities = result.map((user) => UserMapper.userWithoutStudents(user));

    return entities;
  }

  private withFilters({ gender, role }: UserQueryFilters): SQL | undefined {
    const filterSQls: SQL[] = [];
    if (gender) {
      filterSQls.push(sql`${users.gender} = ${gender}`);
    }
    if (role) {
      filterSQls.push(sql`${users.role} = ${role}`);
    }

    if (!filterSQls.length) {
      return undefined;
    }

    return sql.join(filterSQls, sql` and `);
  }
}
