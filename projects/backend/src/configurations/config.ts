import { ConfigModule } from "@nestjs/config";
import { ENV_PATHS } from "@consts/env_paths";
import { authConfig, swaggerConfig, appConfig, postgresConfig, databaseConfig } from "./configs/index";

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [ENV_PATHS.ROOT, ENV_PATHS.BACKEND],
  load: [appConfig, postgresConfig, swaggerConfig, authConfig, databaseConfig],
});
