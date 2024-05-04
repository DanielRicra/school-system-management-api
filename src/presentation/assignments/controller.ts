import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit, parsePKIntegerValue } from "../utils";
import {
  Create,
  FindAll,
  FindOne,
  Patch,
  Remove,
} from "../../domain/use-cases/assignment";
import type { AssignmentRepository } from "../../domain/repositories";
import {
  CreateAssignmentDTO,
  PatchAssignmentDTO,
} from "../../domain/dtos/assignment";

export class AssignmentController extends MainController {
  constructor(private readonly assignmentRepository: AssignmentRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.assignmentRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  findOne: RequestHandler = (req, res) => {
    new FindOne(this.assignmentRepository)
      .execute(parsePKIntegerValue(req.params.id))
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createAssignmentDTO] = CreateAssignmentDTO.create(req.body);

    if (errors || !createAssignmentDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Create(this.assignmentRepository)
      .execute(createAssignmentDTO)
      .then((data) => res.status(201).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  patch: RequestHandler = (req, res) => {
    const [errors, patchAssignmentDTO] = PatchAssignmentDTO.create(req.body);

    if (errors || !patchAssignmentDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Patch(this.assignmentRepository)
      .execute(parsePKIntegerValue(req.params.id), patchAssignmentDTO)
      .then((data) => res.status(200).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  remove: RequestHandler = (req, res) => {
    const id = req.params.id;

    new Remove(this.assignmentRepository)
      .execute(parsePKIntegerValue(id))
      .then(() => res.sendStatus(204))
      .catch((err: unknown) => this.handleErrors(err, res));
  };
}
