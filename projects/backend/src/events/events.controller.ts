// backend/src/events/events.controller.ts
import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post } from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { EventsService } from './events.service';
import { UpdateEventDto , CreateEventDto } from './event.dto'; // <-- Import the DTO

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  GetAll() {
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

  @Post()
  create(
    @Body() CreateEventDto: CreateEventDto,
  ){
    return this.eventsService.create(CreateEventDto);
  }
}