import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import {
  classrooms,
  courses,
  rooms,
  students,
  teachers,
  users,
} from "./drizzle/schema";
import {
  custom,
  length,
  maxLength,
  merge,
  minLength,
  minValue,
  number,
  object,
  omit,
  partial,
  regex,
  string,
  uuid,
} from "valibot";

export const insertRoomSchema = createInsertSchema(rooms, {
  capacity: () => number([minValue(1)]),
});
export const updateRoomSchema = omit(insertRoomSchema, [
  "roomNumber",
  "createdAt",
  "id",
]);
export const selectRoomSchema = createSelectSchema(rooms);

export const insertClassroomSchema = createInsertSchema(classrooms);
export const updateClassroomSchema = omit(insertClassroomSchema, [
  "createdAt",
  "id",
]);
export const patchClassroomSchema = partial(updateClassroomSchema);

const basicInsertSchema = omit(
  createInsertSchema(users, {
    code: () => string([length(6, "Code must be 6 characters")]),
  }),
  ["passwordHash"]
);
export const userPasswordSchema = string([
  minLength(8, "Your password must have at least 8 characters."),
  maxLength(20, "Your password must be less or equal than 20 characters."),
  regex(/[a-z]/, "Your password must contain a lowercase letter."),
  regex(/[A-Z]/, "Your password must contain a uppercase letter."),
  regex(/[0-9]/, "Your password must contain a number."),
]);
export const insertUserSchema = merge([
  basicInsertSchema,
  object({
    password: userPasswordSchema,
  }),
]);

export const updateUserSchema = omit(basicInsertSchema, [
  "id",
  "createdAt",
  "deletedAt",
]);
export const patchUserSchema = partial(updateUserSchema, [
  custom(
    (input) => Object.keys(input).length !== 0,
    "Payload body request must include at least one field."
  ),
]);

export const insertStudentSchema = createInsertSchema(students, {
  userId: () => string([uuid()]),
});
export const patchStudentSchema = partial(
  omit(insertStudentSchema, ["id", "createdAt"]),
  [
    custom(
      (input) => Object.keys(input).length !== 0,
      "Payload body request must include at least one field."
    ),
  ]
);

export const insertTeacherSchema = createInsertSchema(teachers, {
  userId: () => string([uuid()]),
});
export const updateTeacherSchema = omit(insertTeacherSchema, [
  "createdAt",
  "id",
]);
export const patchTeacherSchema = partial(updateTeacherSchema, [
  custom(
    (input) => Object.keys(input).length !== 0,
    "Payload body request must include at least one field."
  ),
]);

export const insertCourseSchema = createInsertSchema(courses, {
  teacherId: () => string([uuid()]),
  code: () => string([length(6)]),
  name: () => string([minLength(1)]),
});
export const patchCourseSchema = partial(
  omit(insertCourseSchema, ["id", "createdAt"]),
  [
    custom(
      (input) => Object.keys(input).length !== 0,
      "Payload body request must include at least one field."
    ),
  ]
);
