import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ maxLength: 20, example: '081-999-1234' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephoneNumber?: string;

  @ApiPropertyOptional({ maxLength: 50, example: 'Gabriel' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ maxLength: 50, example: 'Smith' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ example: 'I love cats' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: '2000-01-01' })
  @IsOptional()
  @IsString()
  birthdate?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['female','male','other','prefer_not'] })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiPropertyOptional({ example: '2025-09-15T08:00:00Z' })
  @IsOptional()
  @IsString()
  signupTime?: string;

  @ApiPropertyOptional({ example: '2025-09-15' })
  @IsOptional()
  @IsDateString()
  signupDate?: string;
}
