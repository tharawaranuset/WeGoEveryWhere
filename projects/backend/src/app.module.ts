import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './configurations/config';
import { AuthModule } from '@core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './core/auth/jwt/access-jwt/jwt.guard';
import { DatabaseModule} from './database/database.module';
import { EventsModule } from './modules/event/event.module'; // <-- 1. Import EventsModule
import { RefreshTokensRepository } from './modules/refreshTokens.repository';
import { ConsentModule } from './modules/consent/consent.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    EventsModule,
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
    RefreshTokensRepository,
  ],
})
export class AppModule {}