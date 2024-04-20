import { Router } from "express";
import { RoomRoutes } from "./room";
import { ClassroomRoutes } from "./classroom";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_, res) => {
      res.send({ routes: ["/room", "/classroom"] });
    });
    router.use("/room", RoomRoutes.routes);
    router.use("/classroom", ClassroomRoutes.routes);

    return router;
  }
}
