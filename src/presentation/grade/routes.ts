import { Router } from "express";
import { GradeDatasourceImpl } from "../../infrastructure/datasources";
import { GradeRepositoryImpl } from "../../infrastructure/repositories";
import { GradeController } from "./controller";

export class GradeRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new GradeDatasourceImpl();
    const repository = new GradeRepositoryImpl(datasource);
    const controller = new GradeController(repository);

    router.route("/").get(controller.findAll).post(controller.create);
    router
      .route("/:id")
      .get(controller.findOne)
      .patch(controller.patch)
      .delete(controller.remove);

    return router;
  }
}
