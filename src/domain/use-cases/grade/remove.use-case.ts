import type { GradeEntity } from "../../entities";
import type { GradeRepository } from "../../repositories";

export class Remove {
  constructor(private readonly courseRepository: GradeRepository) {}
  execute(id: GradeEntity["id"]): Promise<void> {
    return this.courseRepository.remove(id);
  }
}
