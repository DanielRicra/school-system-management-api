import type { QueryParams } from "../../../types";
import type { ListResponseEntity, AssignmentEntity } from "../../entities";
import type { AssignmentRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<AssignmentEntity>> {
    return this.assignmentRepository.findAll(query);
  }
}
