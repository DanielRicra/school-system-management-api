import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import { FindAll, FindOne } from "../../domain/use-cases/student";
import type { StudentRepository } from "../../domain/repositories";
import { computePaginationOffsetAndLimit } from "../utils";
import { isUUIDFormat } from "../../domain/dtos/utils";

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
    res.status(501).json({ error: "Not implemented yet." });
  };

  patch: RequestHandler = (req, res) => {
    res.status(501).json({ error: "Not implemented yet." });
  };

  remove: RequestHandler = (req, res) => {
    res.status(501).json({ error: "Not implemented yet." });
  };
}
