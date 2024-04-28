import { Router } from "express";
import { StudentController } from "./controller";
export class StudentRoutes {
  static get routes(): Router {
    const router = Router();

    const controller = new StudentController();

    router.route("/").get(controller.findAll).post(controller.create);
    router
      .route("/:id")
      .get(controller.findOne)
      .patch(controller.patch)
      .delete(controller.remove);

    return router;
  }
}
