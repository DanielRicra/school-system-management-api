import { Router } from "express";
import { TeacherController } from "./controller";
import { TeacherRepositoryImpl } from "../../infrastructure/repositories";
import { TeacherDatasourceImpl } from "../../infrastructure/datasources";

export class TeacherRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new TeacherDatasourceImpl();
    const repository = new TeacherRepositoryImpl(datasource);
    const controller = new TeacherController(repository);

    router.route("/").get(controller.findAll).post(controller.create);
    router
      .route("/:id")
      .get(controller.findOne)
      .patch(controller.patch)
      .delete(controller.remove);

    return router;
  }
}
