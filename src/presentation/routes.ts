import { Router } from "express";
import { RoomRoutes } from "./room";
import { ClassroomRoutes } from "./classroom";
import { UserRoutes } from "./user";
import { StudentRoutes } from "./student";
import { TeacherRoutes } from "./teacher";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_, res) => {
      res.send({
        routes: ["/room", "/classroom", "/user", "/student", "/teacher"],
      });
    });
    router.use("/room", RoomRoutes.routes);
    router.use("/classroom", ClassroomRoutes.routes);
    router.use("/user", UserRoutes.routes);
    router.use("/student", StudentRoutes.routes);
    router.use("/teacher", TeacherRoutes.routes);

    return router;
  }
}
