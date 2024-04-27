import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import type { UserRepository } from "../../domain/repositories";
import { Create, FindAll, FindOne } from "../../domain/use-cases/user";
import { computePaginationOffsetAndLimit } from "../utils";
import { UserParamsDTO } from "../../domain/dtos/user";
import { CreateUserDTO } from "../../domain/dtos/user";

export class UserController extends MainController {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.userRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  findOne: RequestHandler = (req, res) => {
    const [errors, userParamsDTO] = UserParamsDTO.create(req.params.id);

    if (!userParamsDTO || errors) {
      res.status(400).json(errors);
      return;
    }

    new FindOne(this.userRepository)
      .execute(userParamsDTO.id)
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createUserDTO] = CreateUserDTO.create(req.body);

    if (!createUserDTO || errors) {
      res.status(400).json(errors);
      return;
    }

    new Create(this.userRepository)
      .execute(createUserDTO)
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  update: RequestHandler = (req, res) => {
    res.status(509).send("Method not implemented yet.");
  };

  remove: RequestHandler = (req, res) => {
    res.status(509).send("Method not implemented yet.");
  };

  updatePassword: RequestHandler = (req, res) => {
    res.status(509).send("Method not implemented yet.");
  };
}
