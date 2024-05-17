export class UserEntity {
  constructor(
    public id: string,
    public code: string,
    public firstName: string,
    public surname: string,
    public role: "admin" | "student" | "teacher",
    public gender: string | null,
    public deletedAt: Date | null,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static getProperties() {
    return [
      "id",
      "code",
      "firstName",
      "surname",
      "role",
      "gender",
      "createdAt",
      "updatedAt",
    ];
  }
}
