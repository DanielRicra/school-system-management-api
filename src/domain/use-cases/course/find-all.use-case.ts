import type { QueryParams } from "../../../types";
import type { ListResponseEntity, CourseEntity } from "../../entities";
import type { CourseRepository } from "../../repositories";

export class FindAll {
  constructor(private readonly courseRepository: CourseRepository) {}
  execute(query: QueryParams): Promise<ListResponseEntity<CourseEntity>> {
    return this.courseRepository.findAll(query);
  }
}
