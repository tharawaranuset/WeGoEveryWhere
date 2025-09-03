import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config(); // โหลดค่า .env

if (
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_PORT ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASSWORD ||
  !process.env.POSTGRES_DB
) {
  throw new Error("Database environment variables are not set in .env");
}

export default defineConfig({
  schema: "./src/database/schema/*.ts", // path ไปยัง schema ของคุณ
  out: "./src/database/migrations",    // path สำหรับ migrations
  dialect: "postgresql",                                         // ใช้ PostgreSQL
  dbCredentials: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: false, // ถ้าไม่ได้ใช้ SSL
  },
});
