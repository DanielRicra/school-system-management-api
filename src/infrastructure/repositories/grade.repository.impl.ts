import type { GradeDatasource } from "../../domain/datasources";
import type { CreateGradeDTO, PatchGradeDTO } from "../../domain/dtos/grade";
import type { ListResponseEntity, GradeEntity } from "../../domain/entities";
import type { GradeRepository } from "../../domain/repositories";
import type { QueryParams } from "../../types";

export class GradeRepositoryImpl implements GradeRepository {
  constructor(private readonly gradeDatasource: GradeDatasource) {}

  findAll(query: QueryParams): Promise<ListResponseEntity<GradeEntity>> {
    return this.gradeDatasource.findAll(query);
  }

  findOne(id: GradeEntity["id"]): Promise<GradeEntity> {
    return this.gradeDatasource.findOne(id);
  }

  create(createGradeDTO: CreateGradeDTO): Promise<GradeEntity> {
    return this.gradeDatasource.create(createGradeDTO);
  }

  patch(
    id: GradeEntity["id"],
    patchGradeDTO: PatchGradeDTO
  ): Promise<{ gradeId: GradeEntity["id"] }> {
    return this.gradeDatasource.patch(id, patchGradeDTO);
  }

  remove(id: GradeEntity["id"]): Promise<void> {
    return this.gradeDatasource.remove(id);
  }
}
