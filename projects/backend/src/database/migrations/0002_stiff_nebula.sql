ALTER TABLE "users"
ALTER COLUMN "cookie_policy_version_accepted" TYPE integer
USING cookie_policy_version_accepted::integer;
ALTER TABLE refresh_tokens ADD COLUMN token VARCHAR(255);
ALTER TABLE refresh_tokens ALTER COLUMN id TYPE bigint;