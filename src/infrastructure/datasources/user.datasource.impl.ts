import { type SQL, sql, count, desc, asc, eq } from "drizzle-orm";
import { db, users } from "../../db";
import type { UserDatasource } from "../../domain/datasources";
import type { ListResponseEntity, UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { UserQuery } from "../../domain/types";
import type { QueryParams } from "../../types";
import { ListResponseMapper, UserMapper } from "../mappers";
import type { CreateUserDTO } from "../../domain/dtos/user";
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
      return ListResponseMapper.listResponseFromEntities(
        { count: 0, limit, offset },
        [],
        "user"
      );
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
      "user"
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
