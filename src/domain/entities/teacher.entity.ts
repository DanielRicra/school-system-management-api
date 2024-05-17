import type { UserEntity } from "./user.entity";

export class TeacherEntity {
  constructor(
    public id: string,
    public department: string | null,
    public userId: string,
    public createdAt: string,
    public updatedAt: string,
    public user?: UserEntity
  ) {}

  static getProperties() {
    return ["id", "department", "userId", "createdAt", "updatedAt"];
  }
}
