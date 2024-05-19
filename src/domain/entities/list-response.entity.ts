export class ListResponseEntity<T = unknown> {
  constructor(
    public info?: {
      count: number;
      next: string | null;
      previous: string | null;
      page: number;
      perPage: number;
      lastPage: number;
    },
    public results: T[] = []
  ) {}
}
export type ListResponseInfo = typeof ListResponseEntity.prototype.info;
