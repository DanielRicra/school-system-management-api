export class GradeEntity {
  constructor(
    public id: number,
    public grade: number | null,
    public studentId: string | null,
    public assignmentId: number | null,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static getProperties() {
    return [
      "id",
      "grade",
      "studentId",
      "assignmentId",
      "createdAt",
      "updatedAt",
    ];
  }
}
