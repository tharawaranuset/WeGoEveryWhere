import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// DTO to define the shape of the request body
export class UpdateEventDto {
  Name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.TestApi() ; // Handles GET request to '/'
  }

}