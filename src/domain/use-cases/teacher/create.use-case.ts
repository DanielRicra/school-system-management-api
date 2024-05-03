import type { CreateTeacherDTO } from "../../dtos/teacher";
import type { TeacherRepository } from "../../repositories";

export class Create {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  execute(createTeacherDTO: CreateTeacherDTO) {
    return this.teacherRepository.create(createTeacherDTO);
  }
}
