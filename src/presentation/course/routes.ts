import { Router } from "express";
import { CourseDatasourceImpl } from "../../infrastructure/datasources";
import { CourseRepositoryImpl } from "../../infrastructure/repositories";
import { CourseController } from "./controller";

export class CourseRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new CourseDatasourceImpl();
    const repository = new CourseRepositoryImpl(datasource);
    const controller = new CourseController(repository);

    router.route("/").get(controller.findAll).post(controller.create);
    router
      .route("/:id")
      .get(controller.findOne)
      .patch(controller.patch)
      .delete(controller.remove);

    return router;
  }
}
