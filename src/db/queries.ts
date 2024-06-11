import { and, eq, getTableColumns, ilike, isNull, sql } from "drizzle-orm";
import { db } from "./drizzle/db";
import {
  type Student,
  students,
  users,
  classrooms,
  type User,
  type Classroom,
  teachers,
  type Teacher,
  courses,
  type Course,
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

export function getStudentsByClassroomId(
  classroomId: Classroom["id"]
): Promise<Array<Student & { user: User }>> {
  return db
    .select({
      ...getTableColumns(students),
      user: users,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .leftJoin(classrooms, eq(students.classroomId, classrooms.id))
    .where(eq(classrooms.id, classroomId));
}

export function getClassroomById(
  id: Classroom["id"]
): Promise<Array<Classroom>> {
  return db.select().from(classrooms).where(eq(classrooms.id, id)).limit(1);
}

export function getTeacherById(
  id: Teacher["id"]
): Promise<Array<Teacher & { user: User }>> {
  return db
    .select({ ...getTableColumns(teachers), user: users })
    .from(teachers)
    .innerJoin(users, eq(teachers.userId, users.id))
    .where(eq(teachers.id, id));
}

export function getCoursesByTeacherId(
  teacherId: Teacher["id"]
): Promise<Array<Course>> {
  return db
    .select({ ...getTableColumns(courses) })
    .from(courses)
    .leftJoin(teachers, eq(courses.teacherId, teachers.id))
    .where(eq(courses.teacherId, teacherId));
}

export function getTeachersWithUser() {
  return db
    .select({ ...getTableColumns(teachers), user: users })
    .from(teachers)
    .innerJoin(users, eq(teachers.userId, users.id));
}

export function getUsersWithStudentRoleWithoutStudent(
  surname?: string,
  firstName?: string
): Promise<Array<{ id: User["id"]; fullName: string }>> {
  return db
    .select({
      id: users.id,
      fullName: sql<string>`concat(upper(${users.surname}),', ',${users.firstName})`,
    })
    .from(users)
    .leftJoin(students, eq(users.id, students.userId))
    .where(
      and(
        eq(users.role, "student"),
        isNull(users.deletedAt),
        isNull(students.userId),
        surname ? ilike(users.surname, `%${surname}%`) : undefined,
        firstName ? ilike(users.firstName, `%${firstName}%`) : undefined
      )
    );
}

export function getUsersWithTeacherRoleWithoutTeacher(
  surname?: string,
  firstName?: string
): Promise<Array<{ id: User["id"]; fullName: string }>> {
  return db
    .select({
      id: users.id,
      fullName: sql<string>`concat(upper(${users.surname}),', ',${users.firstName})`,
    })
    .from(users)
    .leftJoin(teachers, eq(users.id, teachers.userId))
    .where(
      and(
        eq(users.role, "teacher"),
        isNull(users.deletedAt),
        isNull(teachers.userId),
        surname ? ilike(users.surname, `%${surname}%`) : undefined,
        firstName ? ilike(users.firstName, `%${firstName}%`) : undefined
      )
    );
}
