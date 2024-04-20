import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit } from "../utils";
import { FindAll, FindOne } from "../../domain/use-cases/classroom";
import type { ClassroomRepository } from "../../domain/repositories";
import { CreateClassroomDTO } from "../../domain/dtos/classroom";
import { Create } from "../../domain/use-cases/classroom/";

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
    new FindOne(this.classroomRepository)
      .execute(+req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleErrors(error, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createClassroomDTO] = CreateClassroomDTO.create(req.body);

    if (errors || !createClassroomDTO) {
      res.status(400).json({ errors });
      return;
    }

    new Create(this.classroomRepository)
      .execute(createClassroomDTO)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleErrors(error, res));
  };

  update: RequestHandler = (req, res) => {
    res.status(501).send("PUT /classroom/:id not implemented");
  };

  remove: RequestHandler = (req, res) => {
    res.status(501).send("DELETE /classroom/:id not implemented");
  };
}
