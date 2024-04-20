import type { QueryParams } from "../../types";
import type { UpdateClassroomDTO } from "../dtos/classroom";
import type { CreateClassroomDTO } from "../dtos/classroom/create-classroom.dto";
import type { ClassroomEntity, ListResponseEntity } from "../entities";
import type { ClassroomQuery } from "../types";

export abstract class ClassroomDatasource {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<ClassroomEntity>>;
  abstract count(query: ClassroomQuery): Promise<number>;
  abstract findOne(id: ClassroomEntity["id"]): Promise<ClassroomEntity>;
  abstract create(
    createClassroomDTO: CreateClassroomDTO
  ): Promise<ClassroomEntity>;
  abstract update(
    id: ClassroomEntity["id"],
    updateClassroomDTO: UpdateClassroomDTO
  ): Promise<ClassroomEntity>;
  abstract remove(id: ClassroomEntity["id"]): Promise<void>;
}
