import type { AssignmentEntity } from "../../entities";
import type { AssignmentRepository } from "../../repositories";

export class Remove {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}
  execute(id: AssignmentEntity["id"]): Promise<void> {
    return this.assignmentRepository.remove(id);
  }
}
