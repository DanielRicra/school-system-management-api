import { Router } from "express";
import { AssignmentDatasourceImpl } from "../../infrastructure/datasources";
import { AssignmentRepositoryImpl } from "../../infrastructure/repositories";
import { AssignmentController } from "./controller";

export class AssignmentRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new AssignmentDatasourceImpl();
    const repository = new AssignmentRepositoryImpl(datasource);
    const controller = new AssignmentController(repository);

    router.route("/").get(controller.findAll).post(controller.create);
    router
      .route("/:id")
      .get(controller.findOne)
      .patch(controller.patch)
      .delete(controller.remove);

    return router;
  }
}
