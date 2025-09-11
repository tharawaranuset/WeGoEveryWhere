import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../../database/connection';
import { users } from '../../database/schema/users.schema';
import { privacyPolicies } from '../../database/schema/privacy-policy.schema';
import { AcceptConsentDto, PolicyResponseDto, ConsentCheckResponseDto } from './dto/consent.dto';

@Injectable()
export class ConsentService {
  async getCurrentActivePolicy(): Promise<PolicyResponseDto> {
    const [activePolicy] = await db
      .select()
      .from(privacyPolicies)
      .where(eq(privacyPolicies.isActive, true))
      .limit(1);

    if (!activePolicy) {
      throw new NotFoundException('No active privacy policy found');
    }

    return {
      id: activePolicy.id,
      version: activePolicy.version,
      title: activePolicy.title,
      content: activePolicy.content,
      effectiveDate: activePolicy.effectiveDate.toISOString(),
    };
  }

  async checkUserConsentStatus(userId: number): Promise<ConsentCheckResponseDto> {
    const [user] = await db
      .select({
        cookiePolicyVersionAccepted: users.cookiePolicyVersionAccepted,
      })
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activePolicy = await this.getCurrentActivePolicy();
    const userVersion = user.cookiePolicyVersionAccepted || 0;
    const currentVersion = activePolicy.version;

    return {
      consentRequired: userVersion < currentVersion,
      currentVersion,
      userVersion,
    };
  }

  async acceptConsent(dto: AcceptConsentDto): Promise<{ success: boolean; updatedVersion: number; acceptedAt: string }> {
    // Verify the policy version exists and is active
    const activePolicy = await this.getCurrentActivePolicy();
    
    if (dto.policyVersion !== activePolicy.version) {
      throw new BadRequestException(
        `Invalid policy version. Current active version is ${activePolicy.version}`
      );
    }

    const now = new Date();

    // Update user's consent information
    await db
      .update(users)
      .set({
        cookiePolicyVersionAccepted: dto.policyVersion,
        cookiePolicyAcceptedAt: now,
      })
      .where(eq(users.userId, dto.userId));

    return {
      success: true,
      updatedVersion: dto.policyVersion,
      acceptedAt: now.toISOString(),
    };
  }
}