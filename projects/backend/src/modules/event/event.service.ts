// backend/src/events/events.service.ts
// backend/src/events/events.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';                                         
import { eq } from 'drizzle-orm';
import { schema } from '@backend/src/database/schema';
import { UpdateEventDto, CreateEventDto } from './event.dto';

@Injectable()
export class EventService {
    private readonly db: NodePgDatabase<typeof schema>;

  constructor(
    private readonly pool: Pool,
  ) {
    this.db = drizzle(this.pool, { schema });
  }

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