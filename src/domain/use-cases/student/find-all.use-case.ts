import type { QueryParams } from "../../../types";
import type { ListResponseEntity, StudentEntity } from "../../entities";
import type { StudentRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly studentRepository: StudentRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<StudentEntity>> {
    return this.studentRepository.findAll(query);
  }
}
