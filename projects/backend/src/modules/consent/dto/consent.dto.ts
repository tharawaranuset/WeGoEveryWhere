import { IsNumber, IsUUID, IsString, IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptConsentDto {
  @ApiProperty({ 
    description: 'User ID who is accepting the consent',
    example: 123
  })
  @IsNumber()
  userId: number;

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

export class CreatePolicyDto {
  @ApiProperty({ 
    description: 'Privacy policy title',
    example: 'Privacy Policy v1.0' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Privacy policy content in plain text',
    example: 'We collect personal data (phone, name, age, sex) solely for account creation purposes under Thailand PDPA compliance.' 
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    description: 'When this policy becomes effective',
    example: '2025-01-01T00:00:00Z' 
  })
  @IsDateString()
  effectiveDate: string;

  @ApiProperty({ 
    description: 'UUID of admin who created this policy',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  createdBy: string;
}

export class CreatePolicyResponseDto {
  @ApiProperty({ description: 'Created policy ID' })
  id: string;

  @ApiProperty({ description: 'Policy version number' })
  version: number;

  @ApiProperty({ description: 'Policy title' })
  title: string;

  @ApiProperty({ description: 'Success message' })
  message: string;
}

export class PolicyHistoryResponseDto {
  @ApiProperty({ description: 'List of all policies' })
  policies: {
    id: string;
    version: number;
    title: string;
    isActive: boolean;
    effectiveDate: string;
    createdAt: string;
  }[];
}

export class UpdatePolicyDto {
  @ApiProperty({ 
    description: 'Privacy policy title',
    example: 'Privacy Policy v1.1 (Updated)' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Privacy policy content in plain text',
    example: 'We collect personal data (phone, name, age, sex) solely for account creation purposes under Thailand PDPA compliance. Updated terms...' 
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    description: 'When this policy becomes effective',
    example: '2025-02-01T00:00:00Z' 
  })
  @IsDateString()
  effectiveDate: string;
}

export class UpdatePolicyResponseDto {
  @ApiProperty({ description: 'Updated policy ID' })
  id: string;

  @ApiProperty({ description: 'Policy version number' })
  version: number;

  @ApiProperty({ description: 'Updated policy title' })
  title: string;

  @ApiProperty({ description: 'Success message' })
  message: string;
}

export class DeletePolicyResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Deleted policy version' })
  deletedVersion: number;

  @ApiProperty({ description: 'Success message' })
  message: string;
}

export class ActivatePolicyDto {
  @ApiProperty({ 
    description: 'Policy version to activate',
    example: 2 
  })
  @IsNumber()
  version: number;
}

export class ActivatePolicyResponseDto {
  @ApiProperty({ description: 'Activated policy ID' })
  id: string;

  @ApiProperty({ description: 'Activated version number' })
  version: number;

  @ApiProperty({ description: 'Success message' })
  message: string;
}