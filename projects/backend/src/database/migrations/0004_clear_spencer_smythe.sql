CREATE TABLE "privacy_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"effective_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_by" uuid NOT NULL,
	CONSTRAINT "privacy_policies_version_unique" UNIQUE("version")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
CREATE INDEX "privacy_policies_version_idx" ON "privacy_policies" USING btree ("version");--> statement-breakpoint
CREATE INDEX "privacy_policies_active_idx" ON "privacy_policies" USING btree ("is_active");