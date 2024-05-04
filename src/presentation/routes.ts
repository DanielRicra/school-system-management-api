import { Router } from "express";
import { RoomRoutes } from "./room";
import { ClassroomRoutes } from "./classroom";
import { UserRoutes } from "./user";
import { StudentRoutes } from "./student";
import { TeacherRoutes } from "./teacher";
import { CourseRoutes } from "./course";
import { AssignmentRoutes } from "./assignments";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_, res) => {
      // biome-ignore format: Leave alone the next line
      res.send({
        routes: [
          "/room", "/classroom", "/user", "/student", "/teacher", "/courses", "/assignment",
        ],
      });
    });
    router.use("/room", RoomRoutes.routes);
    router.use("/classroom", ClassroomRoutes.routes);
    router.use("/user", UserRoutes.routes);
    router.use("/student", StudentRoutes.routes);
    router.use("/teacher", TeacherRoutes.routes);
    router.use("/course", CourseRoutes.routes);
    router.use("/assignment", AssignmentRoutes.routes);

    return router;
  }
}
