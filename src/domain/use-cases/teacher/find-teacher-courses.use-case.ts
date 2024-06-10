import type { CourseEntity, TeacherEntity } from "../../entities";
import type { TeacherRepository } from "../../repositories";

export class FindTeacherCourses {
  constructor(private readonly teacherRepository: TeacherRepository) {}
  execute(id: TeacherEntity["id"]): Promise<CourseEntity[]> {
    return this.teacherRepository.findTeacherCourses(id);
  }
}
