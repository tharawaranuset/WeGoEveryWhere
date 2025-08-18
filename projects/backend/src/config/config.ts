import { ConfigModule } from "@nestjs/config";
import appConfig from "@config/app.config";
import databaseConfig from "@config/postgres.config";
import swaggerConfig from "@config/swagger.config";
import { ENV_PATHS } from "@consts/env_paths";

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [ENV_PATHS.ROOT, ENV_PATHS.BACKEND],
  load: [appConfig, databaseConfig, swaggerConfig],
});
