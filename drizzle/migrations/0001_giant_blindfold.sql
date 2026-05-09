DROP INDEX "idx_idempotency_key";--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_idempotency_key_unique" UNIQUE("idempotency_key");