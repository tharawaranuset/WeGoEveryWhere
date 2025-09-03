ALTER TABLE "users" DROP CONSTRAINT "users_age_check";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "signup_time" SET DEFAULT CURRENT_TIME;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "signup_date" SET DEFAULT CURRENT_DATE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cookie_policy_version_accepted" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cookie_policy_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_age_check" CHECK ("users"."age" > 20);