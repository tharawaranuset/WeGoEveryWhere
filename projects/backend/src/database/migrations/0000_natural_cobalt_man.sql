-- Tables
CREATE TABLE IF NOT EXISTS "admin" (
    "uid" integer PRIMARY KEY NOT NULL,
    "admin_type" varchar(50)
);

CREATE TABLE IF NOT EXISTS "be_friend" (
    "uid" integer NOT NULL,
    "fid" integer NOT NULL,
    CONSTRAINT "be_friend_pkey" PRIMARY KEY("uid","fid")
);

CREATE TABLE IF NOT EXISTS "chat" (
    "sender" integer NOT NULL,
    "receiver" integer NOT NULL,
    "cid" integer NOT NULL,
    CONSTRAINT "chat_pkey" PRIMARY KEY("sender","receiver","cid")
);

CREATE TABLE IF NOT EXISTS "chat_doc" (
    "cid" serial PRIMARY KEY NOT NULL,
    "sdate" date,
    "stime" time,
    "data" jsonb
);

CREATE TABLE IF NOT EXISTS "event" (
    "eid" serial PRIMARY KEY NOT NULL,
    "cost" numeric(10, 2) DEFAULT 0,
    "name" varchar(100) NOT NULL,
    "date" date,
    "time" time,
    "place" varchar(100),
    "capacity" integer NOT NULL,
    "detail" text,
    "rating" double precision DEFAULT 0,
    "uid" integer
);

CREATE TABLE IF NOT EXISTS "joined" (
    "uid" integer NOT NULL,
    "eid" integer NOT NULL,
    CONSTRAINT "joined_pkey" PRIMARY KEY("uid","eid")
);

CREATE TABLE IF NOT EXISTS "participant" (
    "uid" integer PRIMARY KEY NOT NULL,
    "credit" integer DEFAULT 0,
    "status" varchar(20)
);

CREATE TABLE IF NOT EXISTS "report" (
    "rid" serial PRIMARY KEY NOT NULL,
    "report_type" varchar(50),
    "report_detail" text,
    "report_topic" varchar(100),
    "uid" integer
);

CREATE TABLE IF NOT EXISTS "users" (
    "uid" serial PRIMARY KEY NOT NULL,
    "telephone_number" varchar(20),
    "fname" varchar(50) NOT NULL,
    "lname" varchar(50) NOT NULL,
    "bio" text,
    "age" integer,
    "sex" varchar(10),
    "signup_time" time,
    "signup_date" date,
    CONSTRAINT "users_age_check" CHECK (age > 20)
);

-- Foreign keys (with DO block to avoid duplicate error)
DO $$
BEGIN
    ALTER TABLE "admin" ADD CONSTRAINT "admin_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "be_friend" ADD CONSTRAINT "be_friend_fid_fkey" FOREIGN KEY ("fid") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "be_friend" ADD CONSTRAINT "be_friend_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "chat" ADD CONSTRAINT "chat_cid_fkey" FOREIGN KEY ("cid") REFERENCES "chat_doc"("cid") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "chat" ADD CONSTRAINT "chat_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "chat" ADD CONSTRAINT "chat_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "event" ADD CONSTRAINT "event_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "joined" ADD CONSTRAINT "joined_eid_fkey" FOREIGN KEY ("eid") REFERENCES "event"("eid") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "joined" ADD CONSTRAINT "joined_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "participant" ADD CONSTRAINT "participant_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TABLE "report" ADD CONSTRAINT "report_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Index
CREATE INDEX IF NOT EXISTS "idx_events_start_time" ON "event" USING btree ("date" date_ops);
