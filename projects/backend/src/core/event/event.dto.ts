// backend/src/events/dto/update-event.dto.ts

import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
  IsIn
} from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateEventDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsDateString()
  date!: string;

  @IsString()
  time!: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsInt()
  @Min(1)
  capacity!: number;

  @IsString()
  detail!: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsInt()
  userId!: number;
}