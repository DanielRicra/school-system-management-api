import type { AssignmentEntity } from "../../entities";
import type { AssignmentRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}
  execute(id: AssignmentEntity["id"]): Promise<AssignmentEntity> {
    return this.assignmentRepository.findOne(id);
  }
}
