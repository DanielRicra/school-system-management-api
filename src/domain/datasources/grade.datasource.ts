import type { QueryParams } from "../../types";
import type { CreateGradeDTO, PatchGradeDTO } from "../dtos/grade";
import type { ListResponseEntity, GradeEntity } from "../entities";

export abstract class GradeDatasource {
  abstract findAll(
    query: QueryParams
  ): Promise<ListResponseEntity<GradeEntity>>;
  abstract findOne(id: GradeEntity["id"]): Promise<GradeEntity>;
  abstract create(createGradeDTO: CreateGradeDTO): Promise<GradeEntity>;
  abstract patch(
    id: GradeEntity["id"],
    patchGradeDTO: PatchGradeDTO
  ): Promise<{ gradeId: GradeEntity["id"] }>;
  abstract remove(id: GradeEntity["id"]): Promise<void>;
}
