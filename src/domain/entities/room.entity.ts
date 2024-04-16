export class RoomEntity {
  constructor(
    public id: number,
    public roomNumber: string,
    public capacity: number | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
