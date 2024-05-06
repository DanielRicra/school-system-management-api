export class AttendanceEntity {
  constructor(
    public id: number,
    public status: "absent" | "present" | "late",
    public date: Date | null,
    public courseId: number | null,
    public studentId: string | null,
    public createdAt: Date,
    public updatedAt: string
  ) {}

  static getProperties() {
    return [
      "id",
      "status",
      "date",
      "courseId",
      "studentId",
      "createdAt",
      "updatedAt",
    ];
  }
}
