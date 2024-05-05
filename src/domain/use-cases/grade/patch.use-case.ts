import type { PatchGradeDTO } from "../../dtos/grade";
import type { GradeEntity } from "../../entities";
import type { GradeRepository } from "../../repositories";

export class Patch {
  constructor(private readonly courseRepository: GradeRepository) {}

  execute(id: GradeEntity["id"], patchGradeDTO: PatchGradeDTO) {
    return this.courseRepository.patch(id, patchGradeDTO);
  }
}
