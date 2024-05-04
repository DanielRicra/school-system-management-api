import type { Assignment } from "../../db";
import { AssignmentEntity } from "../../domain/entities";
import type { AssignmentQuery } from "../../domain/types";

export class AssignmentMapper {
  static toAssignmentEntity(assignment: Assignment): AssignmentEntity {
    return new AssignmentEntity(
      assignment.id,
      assignment.name,
      assignment.dueDate,
      assignment.courseId,
      assignment.createdAt,
      assignment.updatedAt
    );
  }

  static assignmentQueryFromQueryParams(query: {
    [key: string]: string | undefined;
  }): AssignmentQuery {
    const { ordering, due_date_section, course_id } = query;
    let dueDateSection = due_date_section;

    let sortField: string | undefined = ordering?.startsWith("-")
      ? ordering.slice(1)
      : ordering;

    if (sortField?.includes("_")) {
      const [firstWord, secondWord] = sortField.split("_");
      sortField = `${firstWord}${secondWord[0].toUpperCase()}${secondWord.slice(
        1
      )}`;
    }

    if (sortField && !AssignmentEntity.getProperties().includes(sortField)) {
      sortField = undefined;
    }

    if (
      dueDateSection &&
      !["upcoming", "past_due", "today", "no_date"].includes(dueDateSection)
    ) {
      dueDateSection = undefined;
    }

    return {
      ordering: sortField as AssignmentQuery["ordering"],
      sortDir: ordering?.startsWith("-") ? "desc" : "asc",
      courseId: Number(course_id),
      dueDateSection: dueDateSection as AssignmentQuery["dueDateSection"],
    };
  }
}
