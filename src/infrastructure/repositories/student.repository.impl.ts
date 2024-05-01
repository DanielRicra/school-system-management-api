import type { StudentDatasource } from "../../domain/datasources";
import type { CreateStudentDTO } from "../../domain/dtos/student";
import type { ListResponseEntity, StudentEntity } from "../../domain/entities";
import type { StudentRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class StudentRepositoryImpl implements StudentRepository {
  constructor(private readonly studentDatasource: StudentDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<StudentEntity>> {
    return this.studentDatasource.findAll(query);
  }

  findOne(id: StudentEntity["id"]): Promise<StudentEntity> {
    return this.studentDatasource.findOne(id);
  }

  create(createStudentDTO: CreateStudentDTO): Promise<StudentEntity> {
    return this.studentDatasource.create(createStudentDTO);
  }
}
