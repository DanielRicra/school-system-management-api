ALTER TABLE "attendance" DROP CONSTRAINT "attendance_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "grades" DROP CONSTRAINT "grades_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "course_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "grades" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
