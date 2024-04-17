import { Router } from "express";
import { RoomRoutes } from "./room";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_, res) => {
      res.send({ routes: ["/room"] });
    });
    router.use("/room", RoomRoutes.routes);

    return router;
  }
}
