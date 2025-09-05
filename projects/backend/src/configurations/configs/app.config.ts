import { AppConfig } from '../interfaces/app-config';

export default (): AppConfig => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3001', 10),
  },
});