export class AssignmentEntity {
  constructor(
    public id: number,
    public name: string,
    public dueDate: Date | null,
    public courseId: number | null,
    public createdAt: Date,
    public updatedAt: string
  ) {}

  static getProperties() {
    return ["id", "name", "dueDate", "courseId", "createdAt", "updatedAt"];
  }
}
