import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import {
  Create,
  FindAll,
  FindOne,
  Patch,
  Remove,
} from "../../domain/use-cases/student";
import type { StudentRepository } from "../../domain/repositories";
import { computePaginationOffsetAndLimit } from "../utils";
import { isUUIDFormat } from "../../domain/dtos/utils";
import { CreateStudentDTO, PatchStudentDTO } from "../../domain/dtos/student";

export class StudentController extends MainController {
  constructor(private readonly studentRepository: StudentRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.studentRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  findOne: RequestHandler = (req, res) => {
    const studentId = isUUIDFormat(req.params.id) ? req.params.id : undefined;

    if (!studentId) {
      res.status(400).json({
        message: "The id(UUID) is badly formatted.",
      });
      return;
    }
    new FindOne(this.studentRepository)
      .execute(studentId)
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createStudentDTO] = CreateStudentDTO.create(req.body);

    if (errors || !createStudentDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Create(this.studentRepository)
      .execute(createStudentDTO)
      .then((data) => res.status(201).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  patch: RequestHandler = (req, res) => {
    const studentId = isUUIDFormat(req.params.id) ? req.params.id : undefined;

    if (!studentId) {
      res.status(400).json({
        message: "The id(UUID) is badly formatted.",
      });
      return;
    }

    const [errors, patchStudentDTO] = PatchStudentDTO.create(req.body);

    if (errors || !patchStudentDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Patch(this.studentRepository)
      .execute(studentId, patchStudentDTO)
      .then((data) => res.status(200).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  remove: RequestHandler = (req, res) => {
    const studentId = isUUIDFormat(req.params.id) ? req.params.id : undefined;

    if (!studentId) {
      res.status(400).json({
        message: "The id(UUID) is badly formatted.",
      });
      return;
    }

    new Remove(this.studentRepository)
      .execute(studentId)
      .then(() => res.sendStatus(204))
      .catch((err: unknown) => this.handleErrors(err, res));
  };
}
