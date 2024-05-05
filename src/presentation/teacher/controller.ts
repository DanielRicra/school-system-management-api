import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit } from "../utils";
import {
  Create,
  FindAll,
  FindOne,
  Patch,
  Remove,
} from "../../domain/use-cases/teacher";
import { isUUIDFormat } from "../../utils/helpers";
import type { TeacherRepository } from "../../domain/repositories";
import { CreateTeacherDTO, PatchTeacherDTO } from "../../domain/dtos/teacher";

export class TeacherController extends MainController {
  constructor(private readonly teacherRepository: TeacherRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.teacherRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  findOne: RequestHandler = (req, res) => {
    const teacherId = isUUIDFormat(req.params.id) ? req.params.id : undefined;

    if (!teacherId) {
      res.status(400).json({
        message: "The id(UUID) is badly formatted.",
      });
      return;
    }
    new FindOne(this.teacherRepository)
      .execute(teacherId)
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createTeacherDTO] = CreateTeacherDTO.create(req.body);

    if (errors || !createTeacherDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Create(this.teacherRepository)
      .execute(createTeacherDTO)
      .then((data) => res.status(201).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  patch: RequestHandler = (req, res) => {
    const teacherId = isUUIDFormat(req.params.id) ? req.params.id : undefined;

    if (!teacherId) {
      res.status(400).json({
        message: "The id(UUID) is badly formatted.",
      });
      return;
    }

    const [errors, patchTeacherDTO] = PatchTeacherDTO.create(req.body);

    if (errors || !patchTeacherDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Patch(this.teacherRepository)
      .execute(teacherId, patchTeacherDTO)
      .then((data) => res.status(200).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  remove: RequestHandler = (req, res) => {
    const teacherId = isUUIDFormat(req.params.id) ? req.params.id : undefined;

    if (!teacherId) {
      res.status(400).json({
        message: "The id(UUID) is badly formatted.",
      });
      return;
    }

    new Remove(this.teacherRepository)
      .execute(teacherId)
      .then(() => res.sendStatus(204))
      .catch((err: unknown) => this.handleErrors(err, res));
  };
}
