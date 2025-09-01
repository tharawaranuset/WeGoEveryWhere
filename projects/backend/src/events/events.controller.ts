// backend/src/events/events.controller.ts
import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { EventsService } from './events.service';
import { UpdateEventDto } from './dto/update-event.dto'; // <-- Import the DTO

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  // --- ADD THIS ENDPOINT ---
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }
}