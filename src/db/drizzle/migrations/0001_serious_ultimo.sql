ALTER TABLE "users" ADD COLUMN "user_role" "user_roles" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "user_roles";