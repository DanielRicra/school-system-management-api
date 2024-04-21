import type { UpdateClassroomDTO } from "../../dtos/classroom";
import type { ClassroomEntity } from "../../entities";
import type { ClassroomRepository } from "../../repositories";

export class Update {
  constructor(private readonly classroomRepository: ClassroomRepository) {}
  execute(
    id: ClassroomEntity["id"],
    data: UpdateClassroomDTO
  ): Promise<ClassroomEntity> {
    return this.classroomRepository.update(id, data);
  }
}
