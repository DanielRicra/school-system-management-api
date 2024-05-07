import type { AttendanceDatasource } from "../../domain/datasources";
import type {
  CreateAttendanceDTO,
  PatchAttendanceDTO,
} from "../../domain/dtos/attendance";
import type {
  ListResponseEntity,
  AttendanceEntity,
} from "../../domain/entities";
import type { AttendanceRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class AttendanceRepositoryImpl implements AttendanceRepository {
  constructor(private readonly attendanceDatasource: AttendanceDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<AttendanceEntity>> {
    return this.attendanceDatasource.findAll(query);
  }

  findOne(id: AttendanceEntity["id"]): Promise<AttendanceEntity> {
    return this.attendanceDatasource.findOne(id);
  }

  create(createAttendanceDTO: CreateAttendanceDTO): Promise<AttendanceEntity> {
    return this.attendanceDatasource.create(createAttendanceDTO);
  }

  patch(
    id: AttendanceEntity["id"],
    patchAttendanceDTO: PatchAttendanceDTO
  ): Promise<{ attendanceId: AttendanceEntity["id"] }> {
    return this.attendanceDatasource.patch(id, patchAttendanceDTO);
  }

  remove(id: AttendanceEntity["id"]): Promise<void> {
    return this.attendanceDatasource.remove(id);
  }
}
