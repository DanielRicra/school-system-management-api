import type { QueryParams } from "../../types";
import type { CreateCourseDTO, PatchCourseDTO } from "../dtos/course";
import type { ListResponseEntity, CourseEntity } from "../entities";

export abstract class CourseRepository {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<CourseEntity>>;
  abstract findOne(id: CourseEntity["id"]): Promise<CourseEntity>;
  abstract create(createCourseDTO: CreateCourseDTO): Promise<CourseEntity>;
  abstract patch(
    id: CourseEntity["id"],
    patchCourseDTO: PatchCourseDTO
  ): Promise<{ courseId: CourseEntity["id"] }>;
  abstract remove(id: CourseEntity["id"]): Promise<void>;
}
