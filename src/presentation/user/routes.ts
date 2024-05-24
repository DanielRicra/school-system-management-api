import { Router } from "express";
import { UserController } from "./controller";
import { UserDatasourceImpl } from "../../infrastructure/datasources";
import { UserRepositoryImpl } from "../../infrastructure/repositories";
import { AuthMiddleware, AuthorizationMiddleware } from "../middlewares";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new UserDatasourceImpl();
    const repository = new UserRepositoryImpl(datasource);
    const controller = new UserController(repository);

    router.get("/", AuthMiddleware.checkUserRole("admin"), controller.findAll);
    router.get("/without-student", controller.findUsersWithoutStudent);
    router.get(
      "/:id",
      AuthorizationMiddleware.checkOwnerOrAdmin,
      controller.findOne
    );
    router.post("/", AuthMiddleware.checkUserRole("admin"), controller.create);
    router.put(
      "/:id",
      AuthorizationMiddleware.checkOwnerOrAdmin,
      controller.update
    );
    router.patch(
      "/:id",
      AuthorizationMiddleware.checkOwnerOrAdmin,
      controller.patch
    );
    router.delete(
      "/:id",
      AuthMiddleware.checkUserRole("admin"),
      controller.remove
    );
    router.put(
      "/:id/password",
      AuthMiddleware.checkUserRole("admin"),
      controller.updatePassword
    );

    return router;
  }
}
