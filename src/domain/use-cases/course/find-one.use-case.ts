import type { CourseEntity } from "../../entities";
import type { CourseRepository } from "../../repositories";

export class FindOne {
  constructor(private readonly courseRepository: CourseRepository) {}
  execute(id: CourseEntity["id"]): Promise<CourseEntity> {
    return this.courseRepository.findOne(id);
  }
}
