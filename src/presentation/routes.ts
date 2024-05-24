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
          "/auth", "/rooms", "/classrooms", "/users", "/students", "/teachers", "/courses",
          "/assignments", "/grades", "/attendances"
        ],
      });
    });
    router.use("/auth", AuthRoutes.routes);

    router.use("/", AuthMiddleware.validateJwt);
    router.use("/users", UserRoutes.routes);
    
    router.use("/", AuthMiddleware.checkUserRole("admin"));
    router.use("/rooms", RoomRoutes.routes);
    router.use("/classrooms", ClassroomRoutes.routes);
    router.use("/students", StudentRoutes.routes);
    router.use("/teachers", TeacherRoutes.routes);
    router.use("/courses", CourseRoutes.routes);
    router.use("/assignments", AssignmentRoutes.routes);
    router.use("/grades", GradeRoutes.routes);
    router.use("/attendances", AttendanceRoutes.routes);

    return router;
  }
}
