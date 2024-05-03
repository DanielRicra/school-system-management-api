import type { PatchCourseDTO } from "../../dtos/course";
import type { CourseEntity } from "../../entities";
import type { CourseRepository } from "../../repositories";

export class Patch {
  constructor(private readonly courseRepository: CourseRepository) {}

  execute(id: CourseEntity["id"], patchCourseDTO: PatchCourseDTO) {
    return this.courseRepository.patch(id, patchCourseDTO);
  }
}
