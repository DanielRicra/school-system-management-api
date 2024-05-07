import type { PatchAttendanceDTO } from "../../dtos/attendance";
import type { AttendanceEntity } from "../../entities";
import type { AttendanceRepository } from "../../repositories";

export class Patch {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  execute(id: AttendanceEntity["id"], patchAttendanceDTO: PatchAttendanceDTO) {
    return this.attendanceRepository.patch(id, patchAttendanceDTO);
  }
}
