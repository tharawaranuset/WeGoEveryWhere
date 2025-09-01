// backend/src/events/dto/update-event.dto.ts
export class UpdateEventDto {
  name?: string;
  cost? : number;
  date? : string;
  time? : string;
  place? : string;
  capacity? : number;
  detail? : string;
  rating? :number;
  uid? : number;
}

export class CreateEventDto {
  name!: string;
  cost? : number;
  date? : string;
  time? : string;
  place? : string;
  capacity! : number;
  detail? : string;
  rating? :number;
  uid? : number;
}