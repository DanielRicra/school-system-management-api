import { eq, getTableColumns } from "drizzle-orm";
import { db } from "./drizzle/db";
import {
  type Student,
  students,
  users,
  classrooms,
  type User,
  type Classroom,
} from "./drizzle/schema";

export function getStudentById(
  id: Student["id"]
): Promise<
  Array<
    Student & { user: Omit<User, "passwordHash">; classroom: Classroom | null }
  >
> {
  const { passwordHash, ...rest } = getTableColumns(users);
  return db
    .select({
      ...getTableColumns(students),
      user: { ...rest },
      classroom: classrooms,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .leftJoin(classrooms, eq(students.classroomId, classrooms.id))
    .where(eq(students.id, id));
}
