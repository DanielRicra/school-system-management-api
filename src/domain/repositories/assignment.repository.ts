import type { QueryParams } from "../../types";
import type {
  CreateAssignmentDTO,
  PatchAssignmentDTO,
} from "../dtos/assignment";
import type { ListResponseEntity, AssignmentEntity } from "../entities";

export abstract class AssignmentRepository {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<AssignmentEntity>>;
  abstract findOne(id: AssignmentEntity["id"]): Promise<AssignmentEntity>;
  abstract create(
    createAssignmentDTO: CreateAssignmentDTO
  ): Promise<AssignmentEntity>;
  abstract patch(
    id: AssignmentEntity["id"],
    patchAssignmentDTO: PatchAssignmentDTO
  ): Promise<{ assignmentId: AssignmentEntity["id"] }>;
  abstract remove(id: AssignmentEntity["id"]): Promise<void>;
}
