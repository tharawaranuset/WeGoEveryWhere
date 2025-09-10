ALTER TABLE "users" DROP COLUMN "cookie_policy_version_accepted";
ALTER TABLE "users" ADD COLUMN "cookie_policy_version_accepted" integer;