import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './configurations/config';
import { AuthModule } from '@core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './core/auth/jwt/access-jwt/jwt.guard';
import { DatabaseModule} from './database/database.module';
import { ConsentModule } from './modules/consent/consent.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    DatabaseModule,
    ConsentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
