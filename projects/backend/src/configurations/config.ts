import { ConfigModule } from '@nestjs/config';
import { ENV_PATHS } from '@consts/env_paths';
import { authConfig, swaggerConfig, appConfig } from './configs/index';
import emailConfig from '../shared/config/email.config';

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [ENV_PATHS.ROOT, ENV_PATHS.BACKEND],
  load: [appConfig, swaggerConfig, authConfig, emailConfig],
});
