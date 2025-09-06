// backend/src/events/events.controller.ts
import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post } from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { EventService } from './event.service';
import { UpdateEventDto , CreateEventDto } from './event.dto'; // <-- Import the DTO

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  GetAll() {
    return this.eventService.findAll();
  }

  // --- ADD THIS ENDPOINT ---
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @Post()
  create(
    @Body() CreateEventDto: CreateEventDto,
  ){
    return this.eventService.create(CreateEventDto);
  }
}