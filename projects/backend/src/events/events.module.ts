// backend/src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { DrizzleModule } from '../../db/drizzle.module'; // <-- 1. Import DrizzleModule

@Module({
  imports: [DrizzleModule], // <-- 2. Add it to the imports array
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}