import type { PatchTeacherDTO } from "../../dtos/teacher";
import type { TeacherRepository } from "../../repositories";

export class Patch {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  execute(id: string, patchTeacherDTO: PatchTeacherDTO) {
    return this.teacherRepository.patch(id, patchTeacherDTO);
  }
}
