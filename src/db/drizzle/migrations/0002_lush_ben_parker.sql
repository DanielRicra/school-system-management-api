DO $$ BEGIN
 CREATE TYPE "enrollment_status" AS ENUM('active', 'graduated', 'transferred', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "administrators" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "enrollment_status" "enrollment_status";--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "department" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp (2);--> statement-breakpoint
ALTER TABLE "administrators" ADD CONSTRAINT "administrators_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_unique" UNIQUE("user_id");