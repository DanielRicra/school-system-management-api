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

function getLocaleTimestampString() {
  const utcDate = new Date();
  const offsetInMinutes = utcDate.getTimezoneOffset();
  const offsetInMilliseconds = offsetInMinutes * 60 * 1000;
  return new Date(utcDate.getTime() - offsetInMilliseconds).toISOString();
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
    deletedAt: timestamp("deleted_at", { precision: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .$onUpdate(() => getLocaleTimestampString())
      .notNull(),
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .$onUpdate(() => getLocaleTimestampString())
      .notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
});
export type Classroom = typeof classrooms.$inferSelect;

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .unique()
    .notNull(),
  department: varchar("department", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
});
export type Student = typeof students.$inferSelect;

export const administrators = pgTable("administrators", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .unique()
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
});
export type Administrator = typeof administrators.$inferSelect;

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 6 }).unique().notNull(),
  name: varchar("name").notNull(),
  classroomId: integer("classroom_id").references(() => classrooms.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
});
export type Course = typeof courses.$inferSelect;

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dueDate: timestamp("due_date"),
  courseId: integer("course_id").references(() => courses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
});
export type Assignment = typeof assignments.$inferSelect;

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  grade: smallint("grade"),
  studentId: uuid("student_id").references(() => students.id),
  assignmentId: integer("assignment_id").references(() => assignments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
});
export type Grade = typeof grades.$inferSelect;

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  status: attendanceStatus("status"),
  date: timestamp("date"),
  courseId: integer("course_id").references(() => courses.id),
  studentId: uuid("student_id").references(() => students.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => getLocaleTimestampString())
    .notNull(),
});
export type Attendance = typeof attendance.$inferSelect;
