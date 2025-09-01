// dto/register.dto.ts
import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(1) @MaxLength(50)
  firstName!: string;

  @IsString() @MinLength(1) @MaxLength(50)
  lastName!: string;

  @IsOptional() @IsString() @MaxLength(20)
  telephoneNumber?: string;

  @IsOptional() @IsString()
  bio?: string;

  @IsInt() @Min(0)
  age!: number;

  @IsOptional() @IsString() @MaxLength(10)
  sex?: string;
}
