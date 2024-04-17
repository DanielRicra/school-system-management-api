import { type SQL, asc, desc, eq, count } from "drizzle-orm";
import { db, rooms } from "../../db";
import type { RoomDatasource } from "../../domain/datasources";
import type { ListResponseEntity, RoomEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { RoomMapper } from "../mappers";
import type { QueryParams } from "../../types";
import type { RoomQuery } from "../../domain/types";
import type { CreateRoomDTO } from "../../domain/dtos/room";

export class RoomDatasourceImpl implements RoomDatasource {
  async getRooms(query: QueryParams): Promise<ListResponseEntity<RoomEntity>> {
    const { limit, offset, otherParams } = query;
    const { capacity, ordering, roomNumber, sortDir } =
      RoomMapper.roomQueryFromQueryParams(otherParams);

    try {
      const count = await this.count({
        capacity,
        ordering,
        roomNumber,
        sortDir,
      });

      if (count === 0) {
        return RoomMapper.listResponseFromEntities(
          { count: 0, limit, offset },
          []
        );
      }

      let qb = db.select().from(rooms).$dynamic();

      if (capacity) {
        qb = qb.where(eq(rooms.capacity, capacity));
      }
      if (roomNumber) {
        qb = qb.where(eq(rooms.roomNumber, roomNumber));
      }
      let order: SQL<unknown>;
      if (ordering) {
        order =
          sortDir === "asc" ? asc(rooms[ordering]) : desc(rooms[ordering]);
      } else order = asc(rooms.createdAt);

      const roomsFromDB = await qb.limit(limit).offset(offset).orderBy(order);

      const roomsEntities = roomsFromDB.map((room) =>
        RoomMapper.roomEntityFromObject(room)
      );

      return RoomMapper.listResponseFromEntities(
        { count, limit, offset },
        roomsEntities
      );
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError();
    }
  }

  async count(query: RoomQuery): Promise<number> {
    const { capacity, roomNumber } = query;
    try {
      let qb = db.select({ count: count() }).from(rooms).$dynamic();

      if (capacity) qb = qb.where(eq(rooms.capacity, capacity));
      if (roomNumber) qb = qb.where(eq(rooms.roomNumber, roomNumber));

      const response = await qb;
      return response[0].count;
    } catch (error) {
      throw CustomError.internalServerError();
    }
  }

  async getRoom(id: number): Promise<RoomEntity> {
    try {
      const response = await db
        .select()
        .from(rooms)
        .where(eq(rooms.id, id))
        .limit(1);
      if (response.length === 0) {
        throw CustomError.notFound("Room not found.");
      }
      return RoomMapper.roomEntityFromObject(response[0]);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError();
    }
  }

  async createRoom(createRoomDTO: CreateRoomDTO): Promise<RoomEntity> {
    try {
      const existingRooms = await db
        .select()
        .from(rooms)
        .where(eq(rooms.roomNumber, createRoomDTO.roomNumber));

      if (existingRooms.length > 0) {
        throw CustomError.conflict("Room already exists.");
      }

      const response = (
        await db.insert(rooms).values(createRoomDTO).returning()
      )[0];

      return RoomMapper.roomEntityFromObject(response);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError();
    }
  }
}
