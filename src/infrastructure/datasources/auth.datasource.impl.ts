import { eq } from "drizzle-orm";
import { db, users } from "../../db";
import type { AuthDatasource } from "../../domain/datasources";
import type { SignInUserDTO } from "../../domain/dtos/auth";
import type { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { BcryptAdapter } from "../../config";
import { UserMapper } from "../mappers";

export class AuthDatasourceImpl implements AuthDatasource {
  constructor(private readonly comparePassword = BcryptAdapter.compare) {}

  async signIn(signInUserDTO: SignInUserDTO): Promise<UserEntity> {
    const { code, password } = signInUserDTO;
    const [user] = await db.select().from(users).where(eq(users.code, code));

    if (!user) {
      throw CustomError.badRequest("Invalid credentials.");
    }

    const isPasswordValid = this.comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw CustomError.badRequest("Invalid credentials.");
    }

    return UserMapper.toUserEntity(user);
  }
}
