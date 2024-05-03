import type { TeacherEntity } from "../../entities";
import type { TeacherRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  execute(id: TeacherEntity["id"]): Promise<TeacherEntity> {
    return this.teacherRepository.findOne(id);
  }
}
