import type { TeacherEntity } from "../../entities";
import type { TeacherRepository } from "../../repositories";

export class Remove {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  execute(id: TeacherEntity["id"]): Promise<void> {
    return this.teacherRepository.remove(id);
  }
}
