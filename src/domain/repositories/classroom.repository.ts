import type { QueryParams } from "../../types";
import type { PatchClassroomDTO, UpdateClassroomDTO } from "../dtos/classroom";
import type { CreateClassroomDTO } from "../dtos/classroom/create-classroom.dto";
import type {
  ClassroomEntity,
  ListResponseEntity,
  StudentEntity,
} from "../entities";

export abstract class ClassroomRepository {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<ClassroomEntity>>;
  abstract findOne(id: ClassroomEntity["id"]): Promise<ClassroomEntity>;
  abstract create(
    createClassroomDTO: CreateClassroomDTO
  ): Promise<ClassroomEntity>;
  abstract update(
    id: ClassroomEntity["id"],
    updateClassroomDTO: UpdateClassroomDTO
  ): Promise<ClassroomEntity>;
  abstract remove(id: ClassroomEntity["id"]): Promise<void>;
  abstract patch(
    id: ClassroomEntity["id"],
    patchClassroomDTO: PatchClassroomDTO
  ): Promise<ClassroomEntity>;
  abstract findClassroomStudents(
    id: ClassroomEntity["id"]
  ): Promise<StudentEntity[]>;
}
