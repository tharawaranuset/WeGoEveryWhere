import { SwaggerConfig } from "../interfaces/swagger-config";

export default (): SwaggerConfig => ({
  swagger: {
    title: process.env.SWAGGER_TITLE ?? '',
    description: process.env.SWAGGER_DESCRIPTION ?? '',
    version: process.env.SWAGGER_VERSION ?? '',
  },
});