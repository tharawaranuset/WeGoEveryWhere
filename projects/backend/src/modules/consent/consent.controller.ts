import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { 
  AcceptConsentDto, 
  PolicyResponseDto, 
  ConsentCheckResponseDto,
  AcceptConsentResponseDto, 
  CreatePolicyDto,          
  CreatePolicyResponseDto,  
  PolicyHistoryResponseDto,
  UpdatePolicyDto,
  UpdatePolicyResponseDto,
  DeletePolicyResponseDto,
  ActivatePolicyDto,
  ActivatePolicyResponseDto  
} from './dto/consent.dto';
import { Public } from '@backend/src/shared/decorators/public.decorator';

@ApiTags('Consent Management')
@Controller('api/consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get('current-policy')
  @Public()
  @ApiOperation({ summary: 'Get current active privacy policy' })
  @ApiResponse({ status: 200, description: 'Current privacy policy', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'No active policy found' })
  async getCurrentPolicy(): Promise<PolicyResponseDto> {
    return this.consentService.getCurrentActivePolicy();
  }

  @Get('check/:userId')
  @Public()
  @ApiOperation({ summary: 'Check if user needs to accept new consent' })
  @ApiParam({ name: 'userId', description: 'User ID (number)' })
  @ApiResponse({ status: 200, description: 'Consent status check', type: ConsentCheckResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkConsentStatus(@Param('userId') userId: string): Promise<ConsentCheckResponseDto> {
    return this.consentService.checkUserConsentStatus(parseInt(userId));
  }

  @Post('accept')
  @Public()
  @ApiOperation({ summary: 'Accept privacy policy consent' })
  @ApiResponse({ status: 200, description: 'Consent accepted successfully', type: AcceptConsentResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid policy version or user not found' })
  async acceptConsent(@Body() dto: AcceptConsentDto): Promise<AcceptConsentResponseDto> {
    return this.consentService.acceptConsent(dto);
  }

  @Post('admin/policy')
  //@Public() // use for adding for test
  @ApiOperation({ summary: 'Create new privacy policy (Admin only)' })
  @ApiResponse({ status: 201, description: 'Policy created successfully', type: CreatePolicyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid policy data' })
  async createPolicy(@Body() dto: CreatePolicyDto): Promise<CreatePolicyResponseDto> {
    return this.consentService.createPrivacyPolicy(dto);
  }

  @Get('policies/history')
  //@Public()
  @ApiOperation({ summary: 'Get all privacy policy versions' })
  @ApiResponse({ status: 200, description: 'Policy history', type: PolicyHistoryResponseDto })
  async getPolicyHistory(): Promise<PolicyHistoryResponseDto> {
    return this.consentService.getAllPolicies();
  }

  @Get('policy/:version')
  //@Public()
  @ApiOperation({ summary: 'Get specific policy by version' })
  @ApiParam({ name: 'version', description: 'Policy version number' })
  @ApiResponse({ status: 200, description: 'Policy found', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async getPolicyByVersion(@Param('version') version: string): Promise<PolicyResponseDto> {
    return this.consentService.getPolicyByVersion(parseInt(version));
  }

  @Put('admin/policy/:version')
  //@Public()
  @ApiOperation({ summary: 'Update existing privacy policy (Admin only)' })
  @ApiParam({ name: 'version', description: 'Policy version to update' })
  @ApiResponse({ status: 200, description: 'Policy updated successfully', type: UpdatePolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  @ApiResponse({ status: 400, description: 'Cannot update active policy' })
  async updatePolicy(
    @Param('version') version: string, 
    @Body() dto: UpdatePolicyDto
  ): Promise<UpdatePolicyResponseDto> {
    return this.consentService.updatePolicy(parseInt(version), dto);
  }

  @Delete('admin/policy/:version')
  //@Public()
  @ApiOperation({ summary: 'Delete privacy policy (Admin only)' })
  @ApiParam({ name: 'version', description: 'Policy version to delete' })
  @ApiResponse({ status: 200, description: 'Policy deleted successfully', type: DeletePolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete active policy' })
  async deletePolicy(@Param('version') version: string): Promise<DeletePolicyResponseDto> {
    return this.consentService.deletePolicy(parseInt(version));
  }

  @Post('admin/policy/:version/activate')
  //@Public()
  @ApiOperation({ summary: 'Activate specific policy version (Admin only)' })
  @ApiParam({ name: 'version', description: 'Policy version to activate' })
  @ApiResponse({ status: 200, description: 'Policy activated successfully', type: ActivatePolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async activatePolicy(@Param('version') version: string): Promise<ActivatePolicyResponseDto> {
    return this.consentService.activatePolicy(parseInt(version));
  }
}