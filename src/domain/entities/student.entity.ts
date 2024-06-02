import type { ClassroomEntity } from "./classroom.entity";
import type { UserEntity } from "./user.entity";

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
    public createdAt: string,
    public updatedAt: string,
    public user?: UserEntity,
    public classroom?: ClassroomEntity | null
  ) {}

  static getSortingFields() {
    return [
      "gradeLevel",
      "classroomId",
      "userId",
      "enrollmentStatus",
      "createdAt",
      "updatedAt",
      "user.firstName",
      "user.surname",
    ];
  }
}
