import type { QueryParams } from "../../../types";
import type { ListResponseEntity, GradeEntity } from "../../entities";
import type { GradeRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly gradeRepository: GradeRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<GradeEntity>> {
    return this.gradeRepository.findAll(query);
  }
}
