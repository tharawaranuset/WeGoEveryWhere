CREATE TABLE "_drizzle_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"run_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "oauth_identities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(50) NOT NULL,
	"subject" varchar(100) NOT NULL,
	"email" varchar(100),
	"email_verified" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"revoked" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"created_by_ip" varchar(50),
	"user_agent" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "_drizzle_migrations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "_drizzle_migrations" CASCADE;--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "eid" TO "event_id";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "uid" TO "user_id";--> statement-breakpoint
ALTER TABLE "participant" RENAME COLUMN "uid" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "uid" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "fname" TO "firstName";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "lname" TO "lastName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthdate" DATE;--> statement-breakpoint
ALTER TABLE "chat_doc" RENAME COLUMN "cid" TO "chat_id";--> statement-breakpoint
ALTER TABLE "report" RENAME COLUMN "rid" TO "report_id";--> statement-breakpoint
ALTER TABLE "report" RENAME COLUMN "uid" TO "user_id";--> statement-breakpoint
ALTER TABLE "admin" RENAME COLUMN "uid" TO "user_id";--> statement-breakpoint
ALTER TABLE "joined" RENAME COLUMN "uid" TO "user_id";--> statement-breakpoint
ALTER TABLE "joined" RENAME COLUMN "eid" TO "event_id";--> statement-breakpoint
ALTER TABLE "be_friend" RENAME COLUMN "uid" TO "user_id";--> statement-breakpoint
ALTER TABLE "be_friend" RENAME COLUMN "fid" TO "friend_id";--> statement-breakpoint
ALTER TABLE "chat" RENAME COLUMN "cid" TO "chat_id";--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_uid_fkey";
--> statement-breakpoint
ALTER TABLE "participant" DROP CONSTRAINT "participant_uid_fkey";
--> statement-breakpoint
ALTER TABLE "report" DROP CONSTRAINT "report_uid_fkey";
--> statement-breakpoint
ALTER TABLE "admin" DROP CONSTRAINT "admin_uid_fkey";
--> statement-breakpoint
ALTER TABLE "joined" DROP CONSTRAINT "joined_eid_fkey";
--> statement-breakpoint
ALTER TABLE "joined" DROP CONSTRAINT "joined_uid_fkey";
--> statement-breakpoint
ALTER TABLE "be_friend" DROP CONSTRAINT "be_friend_fid_fkey";
--> statement-breakpoint
ALTER TABLE "be_friend" DROP CONSTRAINT "be_friend_uid_fkey";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_cid_fkey";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_receiver_fkey";
--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_sender_fkey";
--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "cost" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "detail" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "signup_time" SET DEFAULT CURRENT_TIME;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "signup_date" SET DEFAULT CURRENT_DATE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cookie_policy_version_accepted" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cookie_policy_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_identities" ADD CONSTRAINT "oauth_identities_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joined" ADD CONSTRAINT "joined_eventId_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joined" ADD CONSTRAINT "joined_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_friend" ADD CONSTRAINT "be_friend_friendId_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_friend" ADD CONSTRAINT "be_friend_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_chatId_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chat_doc"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joined" DROP CONSTRAINT "joined_pkey";
--> statement-breakpoint
ALTER TABLE "joined" ADD CONSTRAINT "joined_pkey" PRIMARY KEY("user_id","event_id");--> statement-breakpoint
ALTER TABLE "be_friend" DROP CONSTRAINT "be_friend_pkey";
--> statement-breakpoint
ALTER TABLE "be_friend" ADD CONSTRAINT "be_friend_pkey" PRIMARY KEY("user_id","friend_id");--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_pkey";
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_pkey" PRIMARY KEY("sender","receiver","chat_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_age_check" CHECK ("users"."birthdate" <= CURRENT_DATE - INTERVAL '20 years');