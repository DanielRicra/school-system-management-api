import { envs } from "./config";
import { AppRoutes, Server } from "./presentation";

const server = new Server({
  port: envs.PORT,
  route: AppRoutes.routes,
});

server.start();
