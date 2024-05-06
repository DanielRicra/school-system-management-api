import type {
  Assignment,
  Attendance,
  Classroom,
  Course,
  Grade,
  Room,
  Student,
  Teacher,
  User,
} from "../db";

type SortDir = "asc" | "desc";

export type RoomQuery = {
  ordering?: keyof Room;
  sortDir: SortDir;
  capacityGte?: number;
  capacityLte?: number;
  roomNumber?: string;
};

export type ClassroomQuery = {
  ordering?: keyof Classroom;
  sortDir: SortDir;
} & Partial<Omit<Classroom, "id" | "createdAt" | "updatedAt">>;

export type DTOCreateResult<T> = [
  (string | { [key: string]: string | string[] })?,
  T?,
];

export type UserQuery = {
  ordering?: keyof User;
  sortDir: SortDir;
  role?: User["role"];
  gender?: string;
  deletedAt?: Date | null;
};

export type StudentQuery = {
  ordering?: keyof Student;
  sortDir: SortDir;
} & Partial<Omit<Student, "id" | "createdAt" | "updatedAt" | "userId">>;

export type TeacherQuery = {
  ordering?: keyof Teacher;
  sortDir: SortDir;
  department?: string;
};

export type CourseQuery = {
  ordering?: keyof Course;
  sortDir: SortDir;
  classroomId?: number | null;
  teacherId?: string | null;
};

export type AssignmentQuery = {
  ordering?: keyof Assignment;
  sortDir: SortDir;
  dueDateSection?: "upcoming" | "past_due" | "today" | "no_date";
  courseId?: number | null;
};

export type GradeQuery = {
  ordering?: keyof Grade;
  sortDir: SortDir;
  gradeLte?: number;
  gradeGte?: number;
  studentId?: string | null;
  assignmentId?: number | null;
};

export type AttendanceQuery = {
  ordering?: keyof Attendance;
  sortDir: SortDir;
  dayDate?: string;
  hourDate?: number;
} & Partial<Omit<Attendance, "id" | "createdAt" | "updatedAt" | "date">>;
