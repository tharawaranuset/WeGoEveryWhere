import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { 
  AcceptConsentDto, 
  PolicyResponseDto, 
  ConsentCheckResponseDto,
  AcceptConsentResponseDto 
} from './dto/consent.dto';

@ApiTags('Consent Management')
@Controller('api/consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get('current-policy')
  @ApiOperation({ summary: 'Get current active privacy policy' })
  @ApiResponse({ status: 200, description: 'Current privacy policy', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'No active policy found' })
  async getCurrentPolicy(): Promise<PolicyResponseDto> {
    return this.consentService.getCurrentActivePolicy();
  }

  @Get('check/:userId')
  @ApiOperation({ summary: 'Check if user needs to accept new consent' })
  @ApiParam({ name: 'userId', description: 'User ID (number)' })
  @ApiResponse({ status: 200, description: 'Consent status check', type: ConsentCheckResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkConsentStatus(@Param('userId') userId: string): Promise<ConsentCheckResponseDto> {
    return this.consentService.checkUserConsentStatus(parseInt(userId));
  }

  @Post('accept')
  @ApiOperation({ summary: 'Accept privacy policy consent' })
  @ApiResponse({ status: 200, description: 'Consent accepted successfully', type: AcceptConsentResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid policy version or user not found' })
  async acceptConsent(@Body() dto: AcceptConsentDto): Promise<AcceptConsentResponseDto> {
    return this.consentService.acceptConsent(dto);
  }
}