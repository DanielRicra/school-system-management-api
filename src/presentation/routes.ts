import { Router } from "express";
import { RoomRoutes } from "./room";
import { ClassroomRoutes } from "./classroom";
import { UserRoutes } from "./user";
import { StudentRoutes } from "./student";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_, res) => {
      res.send({ routes: ["/room", "/classroom", "/user", "/student"] });
    });
    router.use("/room", RoomRoutes.routes);
    router.use("/classroom", ClassroomRoutes.routes);
    router.use("/user", UserRoutes.routes);
    router.use("/student", StudentRoutes.routes);

    return router;
  }
}
