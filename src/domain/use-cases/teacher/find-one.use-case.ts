import type { TeacherEntity } from "../../entities";
import type { TeacherRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly studentRepository: TeacherRepository) {}
  execute(id: TeacherEntity["id"]): Promise<TeacherEntity> {
    return this.studentRepository.findOne(id);
  }
}
