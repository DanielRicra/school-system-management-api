import type { AssignmentDatasource } from "../../domain/datasources";
import type {
  CreateAssignmentDTO,
  PatchAssignmentDTO,
} from "../../domain/dtos/assignment";
import type {
  ListResponseEntity,
  AssignmentEntity,
} from "../../domain/entities";
import type { AssignmentRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class AssignmentRepositoryImpl implements AssignmentRepository {
  constructor(private readonly assignmentDatasource: AssignmentDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<AssignmentEntity>> {
    return this.assignmentDatasource.findAll(query);
  }

  findOne(id: AssignmentEntity["id"]): Promise<AssignmentEntity> {
    return this.assignmentDatasource.findOne(id);
  }

  create(createAssignmentDTO: CreateAssignmentDTO): Promise<AssignmentEntity> {
    return this.assignmentDatasource.create(createAssignmentDTO);
  }

  patch(
    id: AssignmentEntity["id"],
    patchAssignmentDTO: PatchAssignmentDTO
  ): Promise<{ assignmentId: AssignmentEntity["id"] }> {
    return this.assignmentDatasource.patch(id, patchAssignmentDTO);
  }

  remove(id: AssignmentEntity["id"]): Promise<void> {
    return this.assignmentDatasource.remove(id);
  }
}
