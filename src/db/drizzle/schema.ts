import {
  char,
  integer,
  serial,
  timestamp,
  varchar,
  smallint,
  index,
} from "drizzle-orm/pg-core";
import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";

export const attendanceStatus = pgEnum("attendance_status", [
  "absent",
  "present",
  "late",
]);
export const userRoles = pgEnum("user_roles", ["admin", "student", "teacher"]);
export const gradeLevel = pgEnum("grade_level", [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
]);
export const enrollmentStatus = pgEnum("enrollment_status", [
  "active",
  "graduated",
  "transferred",
  "inactive",
]);

function getTimestamps() {
  return {
    createdAt: timestamp("created_at", {
      mode: "string",
      precision: 0,
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      precision: 0,
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date().toLocaleString())
      .notNull(),
  };
}

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 6 }).unique().notNull(),
    firstName: varchar("first_name", { length: 64 }).notNull(),
    surname: varchar("surname", { length: 64 }).notNull().notNull(),
    passwordHash: varchar("password_hash", { length: 60 }).notNull(),
    role: userRoles("user_role").notNull(),
    gender: char("gender"),
    deletedAt: timestamp("deleted_at", {
      precision: 2,
      mode: "string",
      withTimezone: true,
    }),
    ...getTimestamps(),
  },
  (users) => {
    return {
      surnameIndex: index("surname_idx").on(users.surname),
    };
  }
);
export type User = typeof users.$inferSelect;

export const rooms = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    roomNumber: char("room_number", { length: 3 }).unique().notNull(),
    capacity: smallint("capacity"),
    ...getTimestamps(),
  },
  (rooms) => {
    return {
      roomNumberIndex: index("room_number_idx").on(rooms.roomNumber),
    };
  }
);
export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;

export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  year: char("year", { length: 4 }).notNull(),
  section: char("section", { length: 1 }).notNull(),
  gradeLevel: gradeLevel("grade_level").notNull(),
  roomId: integer("room_id").references(() => rooms.id),
  ...getTimestamps(),
});
export type Classroom = typeof classrooms.$inferSelect;

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .unique()
    .notNull(),
  department: varchar("department", { length: 100 }),
  ...getTimestamps(),
});
export type Teacher = typeof teachers.$inferSelect;

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  gradeLevel: gradeLevel("grade_level").notNull(),
  classroomId: integer("classroom_id").references(() => classrooms.id),
  userId: uuid("user_id")
    .references(() => users.id)
    .unique()
    .notNull(),
  enrollmentStatus: enrollmentStatus("enrollment_status")
    .notNull()
    .default("active"),
  ...getTimestamps(),
});
export type Student = typeof students.$inferSelect;

export const administrators = pgTable("administrators", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .unique()
    .notNull(),
  ...getTimestamps(),
});
export type Administrator = typeof administrators.$inferSelect;

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 6 }).unique().notNull(),
  name: varchar("name").notNull(),
  classroomId: integer("classroom_id").references(() => classrooms.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  ...getTimestamps(),
});
export type Course = typeof courses.$inferSelect;

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dueDate: timestamp("due_date"),
  courseId: integer("course_id").references(() => courses.id),
  ...getTimestamps(),
});
export type Assignment = typeof assignments.$inferSelect;

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  grade: smallint("grade"),
  studentId: uuid("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  assignmentId: integer("assignment_id").references(() => assignments.id),
  ...getTimestamps(),
});
export type Grade = typeof grades.$inferSelect;

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  status: attendanceStatus("status"),
  date: timestamp("date"),
  courseId: integer("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  studentId: uuid("student_id")
    .references(() => students.id, {
      onDelete: "cascade",
    })
    .notNull(),
  ...getTimestamps(),
});
export type Attendance = typeof attendance.$inferSelect;
