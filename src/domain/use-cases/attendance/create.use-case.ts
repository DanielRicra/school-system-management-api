import type { CreateAttendanceDTO } from "../../dtos/attendance";
import type { AttendanceRepository } from "../../repositories";

export class Create {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  execute(createAttendanceDTO: CreateAttendanceDTO) {
    return this.attendanceRepository.create(createAttendanceDTO);
  }
}
