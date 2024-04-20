import type { QueryParams } from "../../../types";
import type { ClassroomEntity, ListResponseEntity } from "../../entities";
import type { ClassroomRepository } from "../../repositories";

interface FinAllUseCase {
  execute(query: QueryParams): Promise<ListResponseEntity<ClassroomEntity>>;
}

export class FindAll implements FinAllUseCase {
  constructor(private readonly classroomRepository: ClassroomRepository) {}

  execute(query: QueryParams): Promise<ListResponseEntity<ClassroomEntity>> {
    return this.classroomRepository.findAll(query);
  }
}
