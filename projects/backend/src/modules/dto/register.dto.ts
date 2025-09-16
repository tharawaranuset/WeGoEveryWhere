// src/modules/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  //not much check because already check at frontend @register page
  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsOptional()
  @IsString()
  telephoneNumber?: string;

  @ApiProperty({ example: 'I love outdoor activities', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '2000-01-01' })
  @IsDateString()
  birthdate: string;

  @ApiProperty({ example: 'male', required: false })
  @IsOptional()
  @IsString()
  sex?: string;
}