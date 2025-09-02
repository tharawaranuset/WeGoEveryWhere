import { IsNumber, IsUUID, IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptConsentDto {
  @ApiProperty({ 
    description: 'User ID who is accepting the consent',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Version of privacy policy being accepted',
    example: 3
  })
  @IsNumber()
  policyVersion: number;
}

export class PolicyResponseDto {
  @ApiProperty({ description: 'Policy unique identifier' })
  id: string;

  @ApiProperty({ description: 'Policy version number', example: 3 })
  version: number;

  @ApiProperty({ description: 'Policy title', example: 'Privacy Policy' })
  title: string;

  @ApiProperty({ description: 'Policy content in plain text' })
  content: string;

  @ApiProperty({ description: 'When this policy becomes effective' })
  effectiveDate: string;
}

export class ConsentCheckResponseDto {
  @ApiProperty({ description: 'Whether user needs to accept new consent' })
  consentRequired: boolean;

  @ApiProperty({ description: 'Current active policy version' })
  currentVersion: number;

  @ApiProperty({ description: 'User\'s accepted policy version' })
  userVersion: number;
}

export class AcceptConsentResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Updated policy version' })
  updatedVersion: number;

  @ApiProperty({ description: 'Timestamp of acceptance' })
  acceptedAt: string;
}