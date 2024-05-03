import type { QueryParams } from "../../types";
import type { CreateTeacherDTO, PatchTeacherDTO } from "../dtos/teacher";
import type { ListResponseEntity, TeacherEntity } from "../entities";

export abstract class TeacherDatasource {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<TeacherEntity>>;
  abstract findOne(id: TeacherEntity["id"]): Promise<TeacherEntity>;
  abstract create(createTeacherDTO: CreateTeacherDTO): Promise<TeacherEntity>;
  abstract patch(
    id: TeacherEntity["id"],
    patchTeacherDTO: PatchTeacherDTO
  ): Promise<{ teacherId: TeacherEntity["id"] }>;
  abstract remove(id: TeacherEntity["id"]): Promise<void>;
}
