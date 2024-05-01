import type { CreateStudentDTO } from "../../dtos/student";
import type { StudentRepository } from "../../repositories";

export class Create {
  constructor(private readonly studentRepository: StudentRepository) {}

  execute(createStudentDTO: CreateStudentDTO) {
    return this.studentRepository.create(createStudentDTO);
  }
}
