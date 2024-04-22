import type { PatchClassroomDTO } from "../../dtos/classroom";
import type { ClassroomEntity } from "../../entities";
import type { ClassroomRepository } from "../../repositories";

export class Patch {
  constructor(private readonly classroomRepository: ClassroomRepository) {}

  execute(
    id: ClassroomEntity["id"],
    data: PatchClassroomDTO
  ): Promise<ClassroomEntity> {
    return this.classroomRepository.patch(id, data);
  }
}
