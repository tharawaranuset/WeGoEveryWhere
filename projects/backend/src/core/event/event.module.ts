// backend/src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { DrizzleModule } from '../../db/drizzle.module'; // <-- 1. Import DrizzleModule

@Module({
  imports: [DrizzleModule], // <-- 2. Add it to the imports array
  controllers: [EventController],
  providers: [EventService],
})
export class EventsModule {}