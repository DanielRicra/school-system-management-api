import type { QueryParams } from "../../types";
import type { CreateStudentDTO, PatchStudentDTO } from "../dtos/student";
import type { ListResponseEntity, StudentEntity } from "../entities";

export abstract class StudentDatasource {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<StudentEntity>>;
  abstract findOne(id: StudentEntity["id"]): Promise<StudentEntity>;
  abstract create(createStudentDTO: CreateStudentDTO): Promise<StudentEntity>;
  abstract patch(
    id: StudentEntity["id"],
    patchStudentDTO: PatchStudentDTO
  ): Promise<{ studentId: StudentEntity["id"] }>;
}
