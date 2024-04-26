import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import type { UserRepository } from "../../domain/repositories";
import { FindAll, FindOne } from "../../domain/use-cases/user";
import { computePaginationOffsetAndLimit } from "../utils";

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
      .catch((err) => {
        console.log(err);

        this.handleErrors(err, res);
      });
  };

  findOne: RequestHandler = (req, res) => {
    new FindOne(this.userRepository)
      .execute(req.params.id)
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    res.status(509).send("Method not implemented yet.");
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
