import type { ClassroomEntity } from "../../entities";
import type { ClassroomRepository } from "../../repositories";

interface FindOneUseCase {
  execute(id: ClassroomEntity["id"]): Promise<ClassroomEntity>;
}

export class FindOne implements FindOneUseCase {
  constructor(private readonly classroomRepository: ClassroomRepository) {}
  execute(id: ClassroomEntity["id"]): Promise<ClassroomEntity> {
    return this.classroomRepository.findOne(id);
  }
}
