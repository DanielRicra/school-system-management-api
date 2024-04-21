import type { ClassroomEntity } from "../../entities";
import type { ClassroomRepository } from "../../repositories";

export class Remove {
  constructor(private readonly classroomRepository: ClassroomRepository) {}

  execute(id: ClassroomEntity["id"]): Promise<void> {
    return this.classroomRepository.remove(id);
  }
}
