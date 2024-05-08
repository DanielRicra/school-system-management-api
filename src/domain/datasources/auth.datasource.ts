import type { SignInUserDTO } from "../dtos/auth";
import type { UserEntity } from "../entities";

export abstract class AuthDatasource {
  abstract signIn(signInUserDTO: SignInUserDTO): Promise<UserEntity>;
}
