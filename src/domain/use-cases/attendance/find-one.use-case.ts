import type { AttendanceEntity } from "../../entities";
import type { AttendanceRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}
  execute(id: AttendanceEntity["id"]): Promise<AttendanceEntity> {
    return this.attendanceRepository.findOne(id);
  }
}
