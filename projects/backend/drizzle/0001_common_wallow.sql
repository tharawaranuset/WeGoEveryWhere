ALTER TABLE "event" ALTER COLUMN "cost" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "status" varchar(100) DEFAULT 'available' NOT NULL;