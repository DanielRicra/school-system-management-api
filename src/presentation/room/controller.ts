import type { RequestHandler } from "express";
import { MainController } from "../main-controller";
import type { RoomRepository } from "../../domain/repositories";
import {
  GetRooms,
  GetRoom,
  CreateRoom,
  UpdateRoom,
  DeleteRoom,
} from "../../domain/use-cases";
import { computePaginationOffsetAndLimit } from "../utils";
import { CreateRoomDTO, UpdateRoomDTO } from "../../domain/dtos/room";

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
    const [errors, createRoomDTO] = CreateRoomDTO.create(req.body);

    if (errors || !createRoomDTO) {
      res.status(400).json({ error: errors });
      return;
    }

    new CreateRoom(this.roomRepository)
      .execute(createRoomDTO)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleErrors(error, res));
  };

  updateRoom: RequestHandler = (req, res) => {
    const { id } = req.params;

    const [errors, updateRoomDTO] = UpdateRoomDTO.create(req.body);

    if (errors || !updateRoomDTO) {
      res.status(400).json({ error: errors });
      return;
    }

    new UpdateRoom(this.roomRepository)
      .execute(Number(id), updateRoomDTO)
      .then((data) => res.json(data))
      .catch((error) => this.handleErrors(error, res));
  };

  deleteRoom: RequestHandler = (req, res) => {
    new DeleteRoom(this.roomRepository)
      .execute(Number(req.params.id))
      .then(() => res.sendStatus(204))
      .catch((error) => this.handleErrors(error, res));
  };
}
