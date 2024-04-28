import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
export class StudentController extends MainController {
  findAll: RequestHandler = (req, res) => {
    res.status(501).json({ error: "Not implemented yet." });
  };

  findOne: RequestHandler = (req, res) => {
    res.status(501).json({ error: "Not implemented yet." });
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
