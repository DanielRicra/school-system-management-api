import { Router } from "express";
import { ClassroomController } from "./controller";
import { ClassroomDatasourceImpl } from "../../infrastructure/datasources";
import { ClassroomRepositoryImpl } from "../../infrastructure/repositories";
export class ClassroomRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new ClassroomDatasourceImpl();
    const repository = new ClassroomRepositoryImpl(datasource);
    const controller = new ClassroomController(repository);

    router.get("/", controller.findAll);
    router.get("/:id", controller.findOne);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
  }
}
