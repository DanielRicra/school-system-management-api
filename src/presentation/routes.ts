import { Router } from "express";
import { RoomRoutes } from "./room";
import { ClassroomRoutes } from "./classroom";
import { UserRoutes } from "./user";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_, res) => {
      res.send({ routes: ["/room", "/classroom", "/user"] });
    });
    router.use("/room", RoomRoutes.routes);
    router.use("/classroom", ClassroomRoutes.routes);
    router.use("/user", UserRoutes.routes);

    return router;
  }
}
