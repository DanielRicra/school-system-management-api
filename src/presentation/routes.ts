import { Router } from "express";
import { RoomRoutes } from "./room";
import { ClassroomRoutes } from "./classroom";
import { UserRoutes } from "./user";
import { StudentRoutes } from "./student";
import { TeacherRoutes } from "./teacher";
import { CourseRoutes } from "./course";
import { AssignmentRoutes } from "./assignments";
import { GradeRoutes } from "./grade";
import { AttendanceRoutes } from "./attendance";
import { AuthRoutes } from "./auth";
import { AuthMiddleware } from "./middlewares";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_, res) => {
      // biome-ignore format: Leave alone the next line
      res.send({
        routes: [
          "/auth", "/room", "/classroom", "/user", "/student", "/teacher", "/courses",
          "/assignment", "/grade", "/attendance"
        ],
      });
    });
    router.use("/auth", AuthRoutes.routes);

    router.use("/", AuthMiddleware.validateJwt);
    router.use(
      "/room",
      AuthMiddleware.checkUserRole("admin"),
      RoomRoutes.routes
    );
    router.use(
      "/classroom",
      AuthMiddleware.checkUserRole("admin"),
      ClassroomRoutes.routes
    );
    router.use("/user", UserRoutes.routes);
    router.use("/student", StudentRoutes.routes);
    router.use("/teacher", TeacherRoutes.routes);
    router.use("/course", CourseRoutes.routes);
    router.use("/assignment", AssignmentRoutes.routes);
    router.use("/grade", GradeRoutes.routes);
    router.use("/attendance", AttendanceRoutes.routes);

    return router;
  }
}
