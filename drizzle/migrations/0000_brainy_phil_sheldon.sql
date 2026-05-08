CREATE TYPE "public"."ab_variant" AS ENUM('A', 'B', 'C');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('new', 'in_progress', 'resolved', 'spam');--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"body" varchar(2000) NOT NULL,
	"status" "contact_status" DEFAULT 'new' NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(512),
	"variant" "ab_variant",
	"idempotency_key" varchar(36),
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_contact_submissions_email" ON "contact_submissions" USING btree ("email") WHERE "contact_submissions"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_contact_submissions_created_at" ON "contact_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_contact_submissions_variant" ON "contact_submissions" USING btree ("variant");--> statement-breakpoint
CREATE INDEX "idx_email_created_at" ON "contact_submissions" USING btree ("email","created_at") WHERE "contact_submissions"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_status_created_at" ON "contact_submissions" USING btree ("status","created_at") WHERE "contact_submissions"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_idempotency_key" ON "contact_submissions" USING btree ("idempotency_key") WHERE "contact_submissions"."idempotency_key" IS NOT NULL;