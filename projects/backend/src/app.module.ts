// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DrizzleProvider } from '../db/drizzle.provider';
import { EventsModule } from './event/event.module'; // <-- 1. Import EventsModule
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    EventsModule, // <-- 2. Add it to the imports array
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, DrizzleProvider],
  exports: [DrizzleProvider],
})
export class AppModule {}