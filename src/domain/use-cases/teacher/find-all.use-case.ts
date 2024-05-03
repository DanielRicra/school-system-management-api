import type { QueryParams } from "../../../types";
import type { ListResponseEntity, TeacherEntity } from "../../entities";
import type { TeacherRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<TeacherEntity>> {
    return this.teacherRepository.findAll(query);
  }
}
