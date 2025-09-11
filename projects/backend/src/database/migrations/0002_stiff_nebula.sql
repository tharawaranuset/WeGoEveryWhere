ALTER TABLE "users"
ALTER COLUMN "cookie_policy_version_accepted" TYPE integer
USING cookie_policy_version_accepted::integer;