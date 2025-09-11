// backend/src/events/events.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common'; // <-- Add NotFoundException
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '@backend/src/database/database.module';
import { schema } from '@backend/src/database/schema';
import { UpdateEventDto , CreateEventDto } from './event.dto'; // <-- Import the DTO

@Injectable()
export class EventService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.select().from(schema.event);
  }

  // --- ADD THIS METHOD ---
  async update(id: number, updateEventDto: UpdateEventDto) {
    // NOTE: Replace 'schema.events.eventId' with the actual ID column from your schema.ts
    const [updatedEvent] = await this.db
      .update(schema.event)
      .set(updateEventDto) // Drizzle can often use the DTO directly!
      .where(eq(schema.event.eventId, id)) 
      .returning();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }
    return updatedEvent;
  }

  async create(createEventDto: CreateEventDto){
    const[newEvent] = await this.db
      .insert(schema.event)
      .values(createEventDto)
      .returning();
    if(!newEvent){
      throw new NotFoundException(`The event is not created successfully.`);
    }
    return newEvent;
  }
}