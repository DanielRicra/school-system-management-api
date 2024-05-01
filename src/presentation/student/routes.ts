import { Router } from "express";
import { StudentController } from "./controller";
import { StudentDatasourceImpl } from "../../infrastructure/datasources";
import { StudentRepositoryImpl } from "../../infrastructure/repositories";
export class StudentRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new StudentDatasourceImpl();
    const repository = new StudentRepositoryImpl(datasource);
    const controller = new StudentController(repository);

    router.route("/").get(controller.findAll).post(controller.create);
    router
      .route("/:id")
      .get(controller.findOne)
      .patch(controller.patch)
      .delete(controller.remove);

    return router;
  }
}
