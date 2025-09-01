import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// DTO to define the shape of the request body
export class UpdateEventDto {
  Name: string;
}

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Welcome to the WeGoEverywhere API!'; // Handles GET request to '/'
  }

}