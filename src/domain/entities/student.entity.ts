export class StudentEntity {
  constructor(
    public id: string,
    public gradeLevel: "1st" | "2nd" | "3rd" | "4th" | "5th",
    public classroomId: number | null,
    public userId: string,
    public enrollmentStatus:
      | "active"
      | "graduated"
      | "transferred"
      | "inactive",
    public createdAt: Date,
    public updatedAt: string
  ) {}

  static getProperties() {
    return [
      "id",
      "gradeLevel",
      "classroomId",
      "userId",
      "enrollmentStatus",
      "createdAt",
      "updatedAt",
    ];
  }
}
