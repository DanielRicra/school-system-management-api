import type { QueryParams } from "../../../types";
import type { ListResponseEntity, TeacherEntity } from "../../entities";
import type { TeacherRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly studentRepository: TeacherRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<TeacherEntity>> {
    return this.studentRepository.findAll(query);
  }
}
