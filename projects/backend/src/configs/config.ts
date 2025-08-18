import { ConfigModule } from "@nestjs/config";
import appConfig from "@backend/src/configs/configs/app.config";
import databaseConfig from "@backend/src/configs/configs/postgres.config";
import swaggerConfig from "@backend/src/configs/configs/swagger.config";
import { ENV_PATHS } from "@consts/env_paths";
import authConfig from "./configs/auth.config";

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [ENV_PATHS.ROOT, ENV_PATHS.BACKEND],
  load: [appConfig, databaseConfig, swaggerConfig, authConfig],
});
