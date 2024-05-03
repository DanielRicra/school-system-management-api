import type { CourseEntity } from "../../entities";
import type { CourseRepository } from "../../repositories";

export class Remove {
  constructor(private readonly courseRepository: CourseRepository) {}
  execute(id: CourseEntity["id"]): Promise<void> {
    return this.courseRepository.remove(id);
  }
}
