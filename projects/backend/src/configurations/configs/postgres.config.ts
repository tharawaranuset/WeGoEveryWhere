import { PostgresConfig } from "../interfaces/postgres-config";

export default (): PostgresConfig => ({
  postgres: {
    db: process.env.POSTGRES_DB ?? '',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? '',
    password: process.env.POSTGRES_PASSWORD ?? '',
  },
});
