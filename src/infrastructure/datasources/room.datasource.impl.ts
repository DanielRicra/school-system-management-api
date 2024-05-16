import { type SQL, asc, desc, eq, count, sql } from "drizzle-orm";
import { db, rooms } from "../../db";
import type { RoomDatasource } from "../../domain/datasources";
import type { ListResponseEntity, RoomEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { ListResponseMapper, RoomMapper } from "../mappers";
import type { QueryParams } from "../../types";
import type { RoomQuery } from "../../domain/types";
import type { CreateRoomDTO, UpdateRoomDTO } from "../../domain/dtos/room";

export class RoomDatasourceImpl implements RoomDatasource {
  async getRooms(query: QueryParams): Promise<ListResponseEntity<RoomEntity>> {
    const { limit, offset, otherParams } = query;
    const { ordering, roomNumber, sortDir, capacityGte, capacityLte } =
      RoomMapper.roomQueryFromQueryParams(otherParams);

    try {
      const count = await this.count({
        ordering,
        roomNumber,
        sortDir,
        capacityGte,
        capacityLte,
      });

      if (count === 0) {
        return ListResponseMapper.listResponseFromEntities(
          { count, limit, offset },
          [],
          "room"
        );
      }

      let qb = db.select().from(rooms).$dynamic();

      if (roomNumber || capacityGte || capacityLte) {
        qb = qb.where(
          this.withFilters({ roomNumber, capacityGte, capacityLte })
        );
      }

      let order: SQL<unknown>;
      if (ordering) {
        order =
          sortDir === "asc" ? asc(rooms[ordering]) : desc(rooms[ordering]);
      } else order = desc(rooms.createdAt);

      const roomsFromDB = await qb.limit(limit).offset(offset).orderBy(order);

      const roomsEntities = roomsFromDB.map((room) =>
        RoomMapper.toRoomEntity(room)
      );

      return ListResponseMapper.listResponseFromEntities<RoomEntity>(
        { limit, offset, count },
        roomsEntities,
        "room"
      );
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError();
    }
  }

  async count(query: RoomQuery): Promise<number> {
    try {
      let qb = db.select({ count: count() }).from(rooms).$dynamic();

      if (query.roomNumber || query.capacityGte || query.capacityLte) {
        qb = qb.where(this.withFilters(query));
      }

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
      return RoomMapper.toRoomEntity(response[0]);
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

      return RoomMapper.toRoomEntity(response);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError();
    }
  }

  async updateRoom(
    id: RoomEntity["id"],
    updateRoomDTO: UpdateRoomDTO
  ): Promise<RoomEntity> {
    try {
      const response = await db
        .update(rooms)
        .set({ capacity: updateRoomDTO.capacity })
        .where(eq(rooms.id, id))
        .returning();

      if (response.length === 0) {
        throw CustomError.notFound("Room not found.");
      }

      return RoomMapper.toRoomEntity(response[0]);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError();
    }
  }

  async deleteRoom(id: number): Promise<void> {
    try {
      const deletedRoom = await db
        .delete(rooms)
        .where(eq(rooms.id, id))
        .returning({ deletedId: rooms.id });

      if (deletedRoom.length === 0) {
        throw CustomError.notFound(
          `The room with id: '${id}' could not be found, failed to delete.`
        );
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError();
    }
  }

  withFilters({
    capacityGte,
    capacityLte,
    roomNumber,
  }: Omit<RoomQuery, "ordering" | "sortDir">): SQL {
    const filterSQls: SQL[] = [];

    if (roomNumber) {
      filterSQls.push(sql`${rooms.roomNumber} = ${roomNumber}`);
    } else {
      if (capacityGte && capacityLte) {
        filterSQls.push(
          sql`${rooms.capacity} >= ${capacityGte} and ${rooms.capacity} <= ${capacityLte}`
        );
      } else if (capacityGte) {
        filterSQls.push(sql`${rooms.capacity} >= ${capacityGte}`);
      } else if (capacityLte) {
        filterSQls.push(sql`${rooms.capacity} <= ${capacityLte}`);
      }
    }

    return sql.join(filterSQls, sql.raw(" "));
  }
}
