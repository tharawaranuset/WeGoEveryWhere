import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../db/drizzle.provider';
import * as schema from '../db/schema';

@Injectable()
export class AppService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private db: NodePgDatabase<typeof schema>,
  ) {}

  // Example: Update a user's full name
  async updateEvent(id: number, newName: string) {
    const [updatedEvent] = await this.db
      .update(schema.event)
      .set({ name: newName })
      .where(eq(schema.event.eid, id))
      .returning(); // Get the updated record back

    return updatedEvent;
  }
}