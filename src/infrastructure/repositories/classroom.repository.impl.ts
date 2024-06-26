import type { ClassroomDatasource } from "../../domain/datasources";
import type {
  CreateClassroomDTO,
  PatchClassroomDTO,
  UpdateClassroomDTO,
} from "../../domain/dtos/classroom";
import type {
  ListResponseEntity,
  ClassroomEntity,
  StudentEntity,
} from "../../domain/entities";
import type { ClassroomRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class ClassroomRepositoryImpl implements ClassroomRepository {
  constructor(private readonly classroomDatasource: ClassroomDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<ClassroomEntity>> {
    return this.classroomDatasource.findAll(query);
  }

  findOne(id: number): Promise<ClassroomEntity> {
    return this.classroomDatasource.findOne(id);
  }

  create(createClassroomDTO: CreateClassroomDTO): Promise<ClassroomEntity> {
    return this.classroomDatasource.create(createClassroomDTO);
  }

  update(
    id: number,
    updateClassroomDTO: UpdateClassroomDTO
  ): Promise<ClassroomEntity> {
    return this.classroomDatasource.update(id, updateClassroomDTO);
  }

  remove(id: number): Promise<void> {
    return this.classroomDatasource.remove(id);
  }

  patch(
    id: ClassroomEntity["id"],
    patchClassroomDTO: PatchClassroomDTO
  ): Promise<ClassroomEntity> {
    return this.classroomDatasource.patch(id, patchClassroomDTO);
  }

  findClassroomStudents(id: ClassroomEntity["id"]): Promise<StudentEntity[]> {
    return this.classroomDatasource.findClassroomStudents(id);
  }
}
