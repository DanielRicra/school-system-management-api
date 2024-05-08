import type { SignInUserDTO } from "../dtos/auth";
import type { UserEntity } from "../entities";

export abstract class AuthRepository {
  abstract signIn(signInUserDTO: SignInUserDTO): Promise<UserEntity>;
}
