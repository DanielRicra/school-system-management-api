import type { RequestHandler } from "express";
import type { AuthRepository } from "../../domain/repositories";
import { MainController } from "../main-controller";
import { SignInUserDTO } from "../../domain/dtos/auth";
import { SignInUser } from "../../domain/use-cases/auth";

export class AuthController extends MainController {
  constructor(private readonly authRepository: AuthRepository) {
    super();
  }

  signIn: RequestHandler = (req, res) => {
    const [error, signinUserDTO] = SignInUserDTO.create(req.body);

    if (error || !signinUserDTO) {
      res.status(400).json({ message: error });
      return;
    }

    new SignInUser(this.authRepository)
      .execute(signinUserDTO)
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };
}
