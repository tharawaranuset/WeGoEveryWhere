import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
  IsIn,
  MaxLength
} from 'class-validator';

export class UpdateUserDto{
    @IsString()
    @MaxLength(20)
    @IsOptional()
    telephoneNumber?: string;

    @IsString()
    @MaxLength(50)
    @IsOptional()
    firstName? : string;

    @IsString()
    @MaxLength(50)
    @IsOptional()
    lastName? : string;

    @IsString()
    @IsOptional()
    bio? : string;

    @IsOptional()
    @IsString()
    birthdate?: string;

    @IsString()
    @MaxLength(10)
    @IsOptional()
    sex?: string;

    @IsOptional()
    @IsString()
    signupTime?: string;

    @IsOptional()
    @IsDateString()
    signupDate: string;
}