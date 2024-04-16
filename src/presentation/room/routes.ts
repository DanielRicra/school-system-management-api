import { Router } from "express";
import { RoomController } from "./controller";
import { RoomRepositoryImpl } from "../../infrastructure/repositories";
import { RoomDatasourceImpl } from "../../infrastructure/datasources";

export class RoomRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new RoomDatasourceImpl();
    const repository = new RoomRepositoryImpl(datasource);
    const controller = new RoomController(repository);

    router.get("/", controller.getRooms);
    router.get("/:id", controller.getRoom);
    router.post("/", controller.createRoom);
    router.put("/:id", controller.updateRoom);
    router.delete("/:id", controller.deleteRoom);

    return router;
  }
}
