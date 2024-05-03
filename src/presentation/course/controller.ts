import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit, parsePKIntegerValue } from "../utils";
import {
  Create,
  FindAll,
  FindOne,
  Patch,
  Remove,
} from "../../domain/use-cases/course";
import type { CourseRepository } from "../../domain/repositories";
import { CreateCourseDTO, PatchCourseDTO } from "../../domain/dtos/course";

export class CourseController extends MainController {
  constructor(private readonly courseRepository: CourseRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.courseRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  findOne: RequestHandler = (req, res) => {
    new FindOne(this.courseRepository)
      .execute(parsePKIntegerValue(req.params.id))
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createCourseDTO] = CreateCourseDTO.create(req.body);

    if (errors || !createCourseDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Create(this.courseRepository)
      .execute(createCourseDTO)
      .then((data) => res.status(201).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  patch: RequestHandler = (req, res) => {
    const [errors, patchCourseDTO] = PatchCourseDTO.create(req.body);

    if (errors || !patchCourseDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Patch(this.courseRepository)
      .execute(parsePKIntegerValue(req.params.id), patchCourseDTO)
      .then((data) => res.status(200).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  remove: RequestHandler = (req, res) => {
    const id = req.params.id;

    new Remove(this.courseRepository)
      .execute(parsePKIntegerValue(id))
      .then(() => res.sendStatus(204))
      .catch((err: unknown) => this.handleErrors(err, res));
  };
}
