import type { AttendanceEntity } from "../../entities";
import type { AttendanceRepository } from "../../repositories";

export class Remove {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}
  execute(id: AttendanceEntity["id"]): Promise<void> {
    return this.attendanceRepository.remove(id);
  }
}
