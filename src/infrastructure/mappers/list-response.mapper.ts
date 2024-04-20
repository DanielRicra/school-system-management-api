import { ListResponseEntity } from "../../domain/entities";

export class ListResponseMapper {
  static listResponseFromEntities<T>(
    data: { limit: number; offset: number; count: number },
    entities: T[],
    route: string
  ): ListResponseEntity<T> {
    const page = data.offset / data.limit + 1;
    const lastPage = data.count === 0 ? 1 : Math.ceil(data.count / data.limit);
    const next = page < lastPage ? `/api/v1/${route}?page=${page + 1}` : null;
    const previous =
      page > 1 && data.count !== 0
        ? `/api/v1/${route}?page=${page < lastPage ? page - 1 : lastPage}`
        : null;
    return new ListResponseEntity<T>(
      {
        count: data.count,
        page,
        perPage: data.limit,
        lastPage,
        next,
        previous,
      },
      entities
    );
  }
}
