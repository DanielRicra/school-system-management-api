export class CourseEntity {
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public classroomId: number | null,
    public teacherId: string | null,
    public createdAt: Date,
    public updatedAt: string
  ) {}

  static getProperties() {
    return ["id", "code", "name", "classroomId", "createdAt", "updatedAt"];
  }
}
