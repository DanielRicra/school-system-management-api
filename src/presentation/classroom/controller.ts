import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit } from "../utils";
import { FindAll } from "../../domain/use-cases/classroom";
import type { ClassroomRepository } from "../../domain/repositories";

export class ClassroomController extends MainController {
  constructor(private readonly classroomRepository: ClassroomRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.classroomRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((error) => this.handleErrors(error, res));
  };

  findOne: RequestHandler = (req, res) => {
    res.status(501).send("GET /classroom/:id not implemented");
  };

  create: RequestHandler = (req, res) => {
    res.status(501).send("POST /classroom not implemented");
  };

  update: RequestHandler = (req, res) => {
    res.status(501).send("PUT /classroom/:id not implemented");
  };

  remove: RequestHandler = (req, res) => {
    res.status(501).send("DELETE /classroom/:id not implemented");
  };
}
