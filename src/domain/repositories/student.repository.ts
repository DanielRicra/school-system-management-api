import type { QueryParams } from "../../types";
import type { ListResponseEntity, StudentEntity } from "../entities";

export abstract class StudentRepository {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<StudentEntity>>;
  abstract findOne(id: StudentEntity["id"]): Promise<StudentEntity>;
}
