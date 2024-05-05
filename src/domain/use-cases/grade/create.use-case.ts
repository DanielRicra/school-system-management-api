import type { CreateGradeDTO } from "../../dtos/grade";
import type { GradeRepository } from "../../repositories";

export class Create {
  constructor(private readonly gradeRepository: GradeRepository) {}

  execute(createGradeDTO: CreateGradeDTO) {
    return this.gradeRepository.create(createGradeDTO);
  }
}
