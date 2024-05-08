import { Router } from "express";
import { AuthDatasourceImpl } from "../../infrastructure/datasources";
import { AuthRepositoryImpl } from "../../infrastructure/repositories";
import { AuthController } from "./controller";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new AuthDatasourceImpl();
    const repository = new AuthRepositoryImpl(datasource);
    const controller = new AuthController(repository);

    router.post("/signin", controller.signIn);

    return router;
  }
}
