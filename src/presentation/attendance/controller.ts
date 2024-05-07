import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { computePaginationOffsetAndLimit, parsePKIntegerValue } from "../utils";
import {
  Create,
  FindAll,
  FindOne,
  Patch,
  Remove,
} from "../../domain/use-cases/attendance";
import type { AttendanceRepository } from "../../domain/repositories";
import {
  CreateAttendanceDTO,
  PatchAttendanceDTO,
} from "../../domain/dtos/attendance";

export class AttendanceController extends MainController {
  constructor(private readonly attendanceRepository: AttendanceRepository) {
    super();
  }

  findAll: RequestHandler = (req, res) => {
    const { page, per_page: perPage, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(page, perPage);

    new FindAll(this.attendanceRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  findOne: RequestHandler = (req, res) => {
    new FindOne(this.attendanceRepository)
      .execute(parsePKIntegerValue(req.params.id))
      .then((data) => res.json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  create: RequestHandler = (req, res) => {
    const [errors, createAttendanceDTO] = CreateAttendanceDTO.create(req.body);

    if (errors || !createAttendanceDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Create(this.attendanceRepository)
      .execute(createAttendanceDTO)
      .then((data) => res.status(201).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  patch: RequestHandler = (req, res) => {
    const [errors, patchAttendanceDTO] = PatchAttendanceDTO.create(req.body);

    if (errors || !patchAttendanceDTO) {
      res.status(400).json({ message: errors });
      return;
    }

    new Patch(this.attendanceRepository)
      .execute(parsePKIntegerValue(req.params.id), patchAttendanceDTO)
      .then((data) => res.status(200).json(data))
      .catch((err: unknown) => this.handleErrors(err, res));
  };

  remove: RequestHandler = (req, res) => {
    const id = req.params.id;

    new Remove(this.attendanceRepository)
      .execute(parsePKIntegerValue(id))
      .then(() => res.sendStatus(204))
      .catch((err: unknown) => this.handleErrors(err, res));
  };
}
