import { Router } from "express";
import { UserController } from "./controller";
import { UserDatasourceImpl } from "../../infrastructure/datasources";
import { UserRepositoryImpl } from "../../infrastructure/repositories";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new UserDatasourceImpl();
    const repository = new UserRepositoryImpl(datasource);
    const controller = new UserController(repository);

    router.get("/", controller.findAll);
    router.get("/:id", controller.findOne);
    router.post("/", controller.create);
    router.put("/", controller.update);
    router.delete("/", controller.remove);
    router.put("/:id/password", controller.updatePassword);

    return router;
  }
}
