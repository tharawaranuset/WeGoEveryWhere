CREATE TABLE "users" (
	"uid" serial PRIMARY KEY NOT NULL,
	"fname" varchar(50) NOT NULL,
	"lname" varchar(50) NOT NULL,
	"telephone_number" varchar(20),
	"bio" text,
	"age" integer NOT NULL,
	"sex" varchar(10),
	"signup_time" time DEFAULT CURRENT_TIME,
	"signup_date" date DEFAULT CURRENT_DATE
);
