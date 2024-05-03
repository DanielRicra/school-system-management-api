import type { CourseDatasource } from "../../domain/datasources";
import type { CreateCourseDTO, PatchCourseDTO } from "../../domain/dtos/course";
import type { ListResponseEntity, CourseEntity } from "../../domain/entities";
import type { CourseRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class CourseRepositoryImpl implements CourseRepository {
  constructor(private readonly courseDatasource: CourseDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<CourseEntity>> {
    return this.courseDatasource.findAll(query);
  }

  findOne(id: CourseEntity["id"]): Promise<CourseEntity> {
    return this.courseDatasource.findOne(id);
  }

  create(createCourseDTO: CreateCourseDTO): Promise<CourseEntity> {
    return this.courseDatasource.create(createCourseDTO);
  }

  patch(
    id: CourseEntity["id"],
    patchCourseDTO: PatchCourseDTO
  ): Promise<{ courseId: CourseEntity["id"] }> {
    return this.courseDatasource.patch(id, patchCourseDTO);
  }

  remove(id: CourseEntity["id"]): Promise<void> {
    return this.courseDatasource.remove(id);
  }
}
