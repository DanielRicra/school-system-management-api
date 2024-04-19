export class ClassroomEntity {
  constructor(
    public id: number,
    public gradeLevel: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public year: string,
    public section: string,
    public roomId: number | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
