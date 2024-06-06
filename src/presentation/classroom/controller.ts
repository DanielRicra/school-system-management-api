import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit, parsePKIntegerValue } from "../utils";
import {
  FindAll,
  FindClassroomStudents,
  FindOne,
  Patch,
  Remove,
  Update,
} from "../../domain/use-cases/classroom";
import type { ClassroomRepository } from "../../domain/repositories";
import {
  CreateClassroomDTO,
  PatchClassroomDTO,
  UpdateClassroomDTO,
} from "../../domain/dtos/classroom";
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
      .execute(parsePKIntegerValue(req.params.id))
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
    const [errors, updateClassroomDto] = UpdateClassroomDTO.create(req.body);

    if (errors || !updateClassroomDto) {
      res.status(400).json(errors);
      return;
    }

    new Update(this.classroomRepository)
      .execute(+req.params.id, updateClassroomDto)
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  remove: RequestHandler = (req, res) => {
    new Remove(this.classroomRepository)
      .execute(Number(req.params.id))
      .then(() => res.sendStatus(204))
      .catch((err) => this.handleErrors(err, res));
  };

  patch: RequestHandler = (req, res) => {
    const [errors, patchClassroomDTO] = PatchClassroomDTO.create(req.body);

    if (errors || !patchClassroomDTO) {
      res.status(400).json(errors);
      return;
    }

    new Patch(this.classroomRepository)
      .execute(Number(req.params.id), patchClassroomDTO)
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };

  findClassroomStudents: RequestHandler = (req, res) => {
    new FindClassroomStudents(this.classroomRepository)
      .execute(parsePKIntegerValue(req.params.id))
      .then((data) => res.json(data))
      .catch((err) => this.handleErrors(err, res));
  };
}
