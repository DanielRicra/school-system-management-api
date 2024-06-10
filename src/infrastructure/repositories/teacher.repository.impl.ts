import type { TeacherDatasource } from "../../domain/datasources";
import type {
  CreateTeacherDTO,
  PatchTeacherDTO,
} from "../../domain/dtos/teacher";
import type {
  CourseEntity,
  ListResponseEntity,
  TeacherEntity,
} from "../../domain/entities";
import type { TeacherRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class TeacherRepositoryImpl implements TeacherRepository {
  constructor(private readonly teacherDatasource: TeacherDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<TeacherEntity>> {
    return this.teacherDatasource.findAll(query);
  }

  findOne(id: TeacherEntity["id"]): Promise<TeacherEntity> {
    return this.teacherDatasource.findOne(id);
  }

  create(createTeacherDTO: CreateTeacherDTO): Promise<TeacherEntity> {
    return this.teacherDatasource.create(createTeacherDTO);
  }

  patch(
    id: string,
    patchTeacherDTO: PatchTeacherDTO
  ): Promise<{ teacherId: string }> {
    return this.teacherDatasource.patch(id, patchTeacherDTO);
  }

  remove(id: string): Promise<void> {
    return this.teacherDatasource.remove(id);
  }

  findTeacherCourses(id: TeacherEntity["id"]): Promise<CourseEntity[]> {
    return this.teacherDatasource.findTeacherCourses(id);
  }
}
