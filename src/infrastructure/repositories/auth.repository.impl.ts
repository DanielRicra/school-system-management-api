import type { AuthDatasource } from "../../domain/datasources";
import type { SignInUserDTO } from "../../domain/dtos/auth";
import type { UserEntity } from "../../domain/entities";
import type { AuthRepository } from "../../domain/repositories";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authDatasource: AuthDatasource) {}

  signIn(signInUserDTO: SignInUserDTO): Promise<UserEntity> {
    return this.authDatasource.signIn(signInUserDTO);
  }
}
