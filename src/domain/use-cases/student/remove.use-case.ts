import type { StudentEntity } from "../../entities";
import type { StudentRepository } from "../../repositories";

export class Remove {
  constructor(private readonly studentRepository: StudentRepository) {}
  execute(id: StudentEntity["id"]): Promise<void> {
    return this.studentRepository.remove(id);
  }
}
