import { JwtAdapter } from "../../../config";
import type { SignInUserDTO } from "../../dtos/auth";
import { CustomError } from "../../errors";
import type { AuthRepository } from "../../repositories";

export class SignInUser {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken = JwtAdapter.generateToken
  ) {}

  async execute(signInUserDTO: SignInUserDTO): Promise<{ token: string }> {
    const { id, code, firstName, surname } =
      await this.authRepository.signIn(signInUserDTO);

    const token = await this.signToken(
      { userId: id, code, firstName, surname },
      "3h"
    );

    if (!token) throw CustomError.internalServerError("Error generating token");

    return {
      token,
    };
  }
}
