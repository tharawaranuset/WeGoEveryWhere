// backend/src/events/events.controller.ts
import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post, Delete , Request , UseGuards } from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { EventService } from './event.service';
import { UpdateEventDto , CreateEventDto } from './event.dto'; // <-- Import the DTO
import { JwtGuard } from '../../core/auth/jwt/access-jwt/jwt.guard'; 

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  GetAll() {
    return this.eventService.findAll();
  }

  // --- ADD THIS ENDPOINT ---
  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(
    @Body() CreateEventDto: CreateEventDto,
    @Request() req,
  ){
    const user_id = req.user.sub;
    console.log(user_id);
    return this.eventService.create(CreateEventDto,user_id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  softDelete(@Param('id', ParseIntPipe) id: number) {
    const updateEventDto = { status: 'deleted' };
    return this.eventService.update(id, updateEventDto);
  }
}