import type { QueryParams } from "../../../types";
import type { ListResponseEntity, AttendanceEntity } from "../../entities";
import type { AttendanceRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<AttendanceEntity>> {
    return this.attendanceRepository.findAll(query);
  }
}
