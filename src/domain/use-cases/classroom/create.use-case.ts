import type { CreateClassroomDTO } from "../../dtos/classroom";
import type { ClassroomEntity } from "../../entities";
import type { ClassroomRepository } from "../../repositories";

export class Create {
  constructor(private readonly classroomRepository: ClassroomRepository) {}
  execute(data: CreateClassroomDTO): Promise<ClassroomEntity> {
    return this.classroomRepository.create(data);
  }
}
