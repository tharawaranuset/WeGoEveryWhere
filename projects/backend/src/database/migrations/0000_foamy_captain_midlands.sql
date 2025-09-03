CREATE TABLE "users" (
	"uid" serial PRIMARY KEY NOT NULL,
	"telephone_number" varchar(20),
	"fname" varchar(50) NOT NULL,
	"lname" varchar(50) NOT NULL,
	"bio" text,
	"age" integer,
	"sex" varchar(10),
	"signup_time" time DEFAULT CURRENT_TIME,
	"signup_date" date DEFAULT CURRENT_DATE,
	"cookie_policy_version_accepted" varchar(20),
	"cookie_policy_accepted_at" timestamp,
	CONSTRAINT "users_age_check" CHECK ("users"."age" > 20)
);
