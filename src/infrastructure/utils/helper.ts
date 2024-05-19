import { gradeLevel, enrollmentStatus } from "../../db";

type GradeLevelKeys = typeof gradeLevel.enumValues;
type EnrollmentStatusKeys = typeof enrollmentStatus.enumValues;

export function checkGradeLevel(
  gradeLevelQuery: string | undefined
): GradeLevelKeys | undefined {
  if (!gradeLevelQuery) return undefined;
  let queryKeys = gradeLevelQuery.split(",").map((val) => val.trim());

  const gradeLevelKeys = new Set<string>(gradeLevel.enumValues);

  queryKeys = queryKeys.filter((gl) => gradeLevelKeys.has(gl));

  return queryKeys.length ? (queryKeys as GradeLevelKeys) : undefined;
}

export function checkEnrollmentStatus(
  enrollmentStatusQuery: string | undefined
): EnrollmentStatusKeys | undefined {
  if (!enrollmentStatusQuery) return undefined;
  let queryKeys = enrollmentStatusQuery.split(",").map((val) => val.trim());

  const enrollmentStatusKeys = new Set<string>(enrollmentStatus.enumValues);

  queryKeys = queryKeys.filter((gl) => enrollmentStatusKeys.has(gl));

  return queryKeys.length ? (queryKeys as EnrollmentStatusKeys) : undefined;
}
