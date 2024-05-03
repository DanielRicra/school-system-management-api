import type { CreateCourseDTO } from "../../dtos/course";
import type { CourseRepository } from "../../repositories";

export class Create {
  constructor(private readonly courseRepository: CourseRepository) {}

  execute(createCourseDTO: CreateCourseDTO) {
    return this.courseRepository.create(createCourseDTO);
  }
}
