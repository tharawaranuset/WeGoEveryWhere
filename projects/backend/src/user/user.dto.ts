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
    fname? : string;

    @IsString()
    @MaxLength(50)
    @IsOptional()
    lname? : string;

    @IsString()
    @IsOptional()
    bio? : string;

    @IsNumber()
    age?: number;

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