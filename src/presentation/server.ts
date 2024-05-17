import express, {
  type Router,
  type Express,
  type NextFunction,
  type Response,
  type Request,
} from "express";
import cors from "cors";
import morgan from "morgan";

type ServerOption = {
  port?: number;
  route: Router;
};

export class Server {
  public readonly port: number;
  public readonly router: Router;
  public readonly app: Express;

  public constructor(option: ServerOption) {
    this.port = option.port ?? 3000;
    this.router = option.route;
    this.app = express();

    this.configure();
  }

  configure() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("tiny"));

    this.app.get("/", (req, res) => res.json({ url: "/api/v1" }));
    this.app.use("/api/v1", this.router);
    this.app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });
    this.app.use(
      (error: unknown, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({ message: "Internal server error." });
      }
    );
  }

  async start() {
    this.app.listen(this.port, () => {
      console.log(`Server running in port http://localhost:${this.port}`);
    });
  }

  get getApp() {
    return this.app;
  }
}
