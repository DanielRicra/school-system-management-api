import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import type { RoomRepository } from "../../domain/repositories";
import { GetRooms, GetRoom } from "../../domain/use-cases";
import { computePaginationOffsetAndLimit } from "../utils";

export class RoomController extends MainController {
  constructor(private readonly roomRepository: RoomRepository) {
    super();
  }

  getRooms: RequestHandler = async (req, res) => {
    const { page: pageParam, per_page: perPageParam, ...query } = req.query;
    const { limit, offset } = computePaginationOffsetAndLimit(
      pageParam,
      perPageParam
    );

    new GetRooms(this.roomRepository)
      .execute({
        limit,
        offset,
        otherParams: query as { [key: string]: string },
      })
      .then((data) => res.json(data))
      .catch((error) => this.handleErrors(error, res));
  };

  getRoom: RequestHandler = (req, res) => {
    new GetRoom(this.roomRepository)
      .execute(Number(req.params.id))
      .then((data) => res.json(data))
      .catch((error) => this.handleErrors(error, res));
  };

  createRoom: RequestHandler = (req, res) => {
    res.status(501).json({ message: "Not implement yet" });
  };

  updateRoom: RequestHandler = (req, res) => {
    res.status(501).json({ message: "Not implement yet" });
  };

  deleteRoom: RequestHandler = (req, res) => {
    res.status(501).json({ message: "Not implement yet" });
  };
}
