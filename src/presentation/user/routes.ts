import { Router } from "express";
import { UserController } from "./controller";
import { UserDatasourceImpl } from "../../infrastructure/datasources";
import { UserRepositoryImpl } from "../../infrastructure/repositories";
import { AuthMiddleware } from "../middlewares";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new UserDatasourceImpl();
    const repository = new UserRepositoryImpl(datasource);
    const controller = new UserController(repository);

    router.get("/", AuthMiddleware.checkUserRole("admin"), controller.findAll);
    router.get("/:id", controller.findOne);
    router.post("/", AuthMiddleware.checkUserRole("admin"), controller.create);
    router.put("/:id", controller.update);
    router.patch("/:id", controller.patch);
    router.delete(
      "/:id",
      AuthMiddleware.checkUserRole("admin"),
      controller.remove
    );
    router.put("/:id/password", controller.updatePassword);

    return router;
  }
}
