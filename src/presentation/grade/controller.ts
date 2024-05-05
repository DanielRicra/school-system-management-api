import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit, parsePKIntegerValue } from "../utils";
import {
  Create,
  FindAll,
  FindOne,
  Patch,
  Remove,
} from "../../domain/use-cases/grade";
import type { GradeRepository } from "../../domain/repositories";
import { CreateGradeDTO, PatchGradeDTO } from "../../domain/dtos/grade";

export class GradeController extends MainController {
  constructor(private readonly gradeRepository: GradeRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.gradeRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  findOne: RequestHandler = (req, res) => {
    new FindOne(this.gradeRepository)
      .execute(parsePKIntegerValue(req.params.id))
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createGradeDTO] = CreateGradeDTO.create(req.body);

    if (errors || !createGradeDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Create(this.gradeRepository)
      .execute(createGradeDTO)
      .then((data) => res.status(201).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  patch: RequestHandler = (req, res) => {
    const [errors, patchGradeDTO] = PatchGradeDTO.create(req.body);

    if (errors || !patchGradeDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Patch(this.gradeRepository)
      .execute(parsePKIntegerValue(req.params.id), patchGradeDTO)
      .then((data) => res.status(200).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  remove: RequestHandler = (req, res) => {
    const id = req.params.id;

    new Remove(this.gradeRepository)
      .execute(parsePKIntegerValue(id))
      .then(() => res.sendStatus(204))
      .catch((err: unknown) => this.handleErrors(err, res));
  };
}
