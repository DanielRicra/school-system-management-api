import type { PatchAssignmentDTO } from "../../dtos/assignment";
import type { AssignmentEntity } from "../../entities";
import type { AssignmentRepository } from "../../repositories";

export class Patch {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  execute(id: AssignmentEntity["id"], patchAssignmentDTO: PatchAssignmentDTO) {
    return this.assignmentRepository.patch(id, patchAssignmentDTO);
  }
}
