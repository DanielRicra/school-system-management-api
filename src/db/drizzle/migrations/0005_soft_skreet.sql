ALTER TABLE "rooms" ALTER COLUMN "created_at" SET DATA TYPE timestamp (0) with time zone;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (0) with time zone;