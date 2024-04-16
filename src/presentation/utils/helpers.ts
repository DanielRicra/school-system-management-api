export function computePaginationOffsetAndLimit(
  pageParam?: unknown,
  perPageParam?: unknown
): { offset: number; limit: number } {
  let page = 1;
  let perPage = 10;

  if (pageParam && !Number.isNaN(pageParam) && +pageParam > 0) {
    page = +pageParam;
  }

  if (perPageParam && !Number.isNaN(perPageParam) && +perPageParam > 1) {
    perPage = +perPageParam;
  }
  return { offset: (page - 1) * perPage, limit: perPage };
}
