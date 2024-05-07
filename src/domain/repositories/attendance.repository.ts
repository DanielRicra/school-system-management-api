import type { QueryParams } from "../../types";
import type {
  CreateAttendanceDTO,
  PatchAttendanceDTO,
} from "../dtos/attendance";
import type { ListResponseEntity, AttendanceEntity } from "../entities";

export abstract class AttendanceRepository {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<AttendanceEntity>>;
  abstract findOne(id: AttendanceEntity["id"]): Promise<AttendanceEntity>;
  abstract create(
    createAttendanceDTO: CreateAttendanceDTO
  ): Promise<AttendanceEntity>;
  abstract patch(
    id: AttendanceEntity["id"],
    patchAttendanceDTO: PatchAttendanceDTO
  ): Promise<{ attendanceId: AttendanceEntity["id"] }>;
  abstract remove(id: AttendanceEntity["id"]): Promise<void>;
}
