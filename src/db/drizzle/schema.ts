import { sql } from "drizzle-orm";
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

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 6 }).unique().notNull(),
    firstName: varchar("first_name", { length: 64 }).notNull(),
    surname: varchar("surname", { length: 64 }).notNull().notNull(),
    passwordHash: varchar("password_hash", { length: 60 }).notNull(),
    role: attendanceStatus("user_roles").notNull(),
    gender: char("gender"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (users) => {
    return {
      surnameIndex: index("surname_idx").on(users.surname),
    };
  }
);

export const rooms = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    roomNumber: char("room_number", { length: 3 }).unique().notNull(),
    capacity: smallint("capacity"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (rooms) => {
    return {
      roomNumberIndex: index("room_number_idx").on(rooms.roomNumber),
    };
  }
);

export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  year: char("year", { length: 4 }).notNull(),
  section: char("section", { length: 1 }).notNull(),
  gradeLevel: gradeLevel("grade_level").notNull(),
  roomId: integer("room_id").references(() => rooms.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  gradeLevel: gradeLevel("grade_level").notNull(),
  classroomId: integer("classroom_id").references(() => classrooms.id),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const administrators = pgTable("administrators", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 6 }).unique().notNull(),
  name: varchar("name").notNull(),
  classroomId: integer("classroom_id").references(() => classrooms.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dueDate: timestamp("due_date"),
  courseId: integer("course_id").references(() => courses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  grade: smallint("grade"),
  studentId: uuid("student_id").references(() => students.id),
  assignmentId: integer("assignment_id").references(() => assignments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  status: attendanceStatus("status"),
  date: timestamp("date"),
  courseId: integer("course_id").references(() => courses.id),
  studentId: uuid("student_id").references(() => students.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
