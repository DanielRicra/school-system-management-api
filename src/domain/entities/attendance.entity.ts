export class AttendanceEntity {
  constructor(
    public id: number,
    public status: "absent" | "present" | "late" | null,
    public date: Date | null,
    public courseId: number,
    public studentId: string,
    public createdAt: string,
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
