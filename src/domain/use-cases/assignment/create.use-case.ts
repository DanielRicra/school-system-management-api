import type { CreateAssignmentDTO } from "../../dtos/assignment";
import type { AssignmentRepository } from "../../repositories";

export class Create {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  execute(createAssignmentDTO: CreateAssignmentDTO) {
    return this.assignmentRepository.create(createAssignmentDTO);
  }
}
