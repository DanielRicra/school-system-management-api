import type { ClassroomEntity, StudentEntity } from "../../entities";
import type { ClassroomRepository } from "../../repositories";

export class FindClassroomStudents {
  constructor(private readonly classroomRepository: ClassroomRepository) {}
  execute(id: ClassroomEntity["id"]): Promise<StudentEntity[]> {
    return this.classroomRepository.findClassroomStudents(id);
  }
}
