import { Router } from "express";
import { AttendanceDatasourceImpl } from "../../infrastructure/datasources";
import { AttendanceRepositoryImpl } from "../../infrastructure/repositories";
import { AttendanceController } from "./controller";

export class AttendanceRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new AttendanceDatasourceImpl();
    const repository = new AttendanceRepositoryImpl(datasource);
    const controller = new AttendanceController(repository);

    router.route("/").get(controller.findAll).post(controller.create);
    router
      .route("/:id")
      .get(controller.findOne)
      .patch(controller.patch)
      .delete(controller.remove);

    return router;
  }
}
