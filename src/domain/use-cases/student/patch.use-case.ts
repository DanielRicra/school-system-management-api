import type { PatchStudentDTO } from "../../dtos/student";
import type { StudentRepository } from "../../repositories";

export class Patch {
  constructor(private readonly studentRepository: StudentRepository) {}

  execute(id: string, patchStudentDTO: PatchStudentDTO) {
    return this.studentRepository.patch(id, patchStudentDTO);
  }
}
