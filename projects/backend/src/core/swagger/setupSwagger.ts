import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication, configService: ConfigService): void{
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title', ''))
    .setDescription(configService.get<string>('swagger.description', ''))
    .setVersion(configService.get<string>('swagger.version', ''))
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}