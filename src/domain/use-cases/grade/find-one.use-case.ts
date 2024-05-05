import type { GradeEntity } from "../../entities";
import type { GradeRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly courseRepository: GradeRepository) {}
  execute(id: GradeEntity["id"]): Promise<GradeEntity> {
    return this.courseRepository.findOne(id);
  }
}
