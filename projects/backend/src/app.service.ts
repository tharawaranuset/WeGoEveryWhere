import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  CreateEvent(createEventDto): string{
    return 'Create Event!';
  };

}
