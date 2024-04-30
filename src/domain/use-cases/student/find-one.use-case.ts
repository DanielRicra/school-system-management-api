import type { StudentEntity } from "../../entities";
import type { StudentRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly studentRepository: StudentRepository) {}
  execute(id: StudentEntity["id"]): Promise<StudentEntity> {
    return this.studentRepository.findOne(id);
  }
}
