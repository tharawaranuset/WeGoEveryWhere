import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../database/connection';
import { users } from '../../database/schema/users.schema';
import { privacyPolicies } from '../../database/schema/privacy-policy.schema';
import { 
  AcceptConsentDto, 
  PolicyResponseDto, 
  ConsentCheckResponseDto,
  CreatePolicyDto,
  CreatePolicyResponseDto,
  PolicyHistoryResponseDto,
  UpdatePolicyDto,
  UpdatePolicyResponseDto,
  DeletePolicyResponseDto,
  ActivatePolicyResponseDto 
} from './dto/consent.dto';

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
  
  async createPrivacyPolicy(dto: CreatePolicyDto): Promise<CreatePolicyResponseDto> {
  // Get next version number
  const latestPolicy = await db
    .select({ version: privacyPolicies.version })
    .from(privacyPolicies)
    .orderBy(desc(privacyPolicies.version))
    .limit(1);

  const nextVersion = latestPolicy.length > 0 ? latestPolicy[0].version + 1 : 1;

  // Deactivate current active policy
  await db
    .update(privacyPolicies)
    .set({ isActive: false })
    .where(eq(privacyPolicies.isActive, true));

  // Create new policy
  const [newPolicy] = await db
    .insert(privacyPolicies)
    .values({
      version: nextVersion,
      title: dto.title,
      content: dto.content,
      effectiveDate: new Date(dto.effectiveDate),
      createdBy: dto.createdBy,
      isActive: true,
    })
    .returning();

  return {
    id: newPolicy.id,
    version: newPolicy.version,
    title: newPolicy.title,
    message: `Privacy policy version ${nextVersion} created and activated successfully`,
  };
}

async getAllPolicies(): Promise<PolicyHistoryResponseDto> {
  const policies = await db
    .select({
      id: privacyPolicies.id,
      version: privacyPolicies.version,
      title: privacyPolicies.title,
      isActive: privacyPolicies.isActive,
      effectiveDate: privacyPolicies.effectiveDate,
      createdAt: privacyPolicies.createdAt,
    })
    .from(privacyPolicies)
    .orderBy(desc(privacyPolicies.version));

  return { 
    policies: policies.map(policy => ({
      ...policy,
      effectiveDate: policy.effectiveDate.toISOString(),
      createdAt: policy.createdAt.toISOString(),
    }))
  };
  }
  
async getPolicyByVersion(version: number): Promise<PolicyResponseDto> {
  const [policy] = await db
    .select()
    .from(privacyPolicies)
    .where(eq(privacyPolicies.version, version))
    .limit(1);

  if (!policy) {
    throw new NotFoundException(`Policy version ${version} not found`);
  }

  return {
    id: policy.id,
    version: policy.version,
    title: policy.title,
    content: policy.content,
    effectiveDate: policy.effectiveDate.toISOString(),
  };
}

async updatePolicy(version: number, dto: UpdatePolicyDto): Promise<UpdatePolicyResponseDto> {
  // Check if policy exists
  const [existingPolicy] = await db
    .select()
    .from(privacyPolicies)
    .where(eq(privacyPolicies.version, version))
    .limit(1);

  if (!existingPolicy) {
    throw new NotFoundException(`Policy version ${version} not found`);
  }

  // Don't allow updating active policy
  if (existingPolicy.isActive) {
    throw new BadRequestException('Cannot update active policy. Deactivate it first or create a new version.');
  }

  // Update the policy
  const [updatedPolicy] = await db
    .update(privacyPolicies)
    .set({
      title: dto.title,
      content: dto.content,
      effectiveDate: new Date(dto.effectiveDate),
    })
    .where(eq(privacyPolicies.version, version))
    .returning();

  return {
    id: updatedPolicy.id,
    version: updatedPolicy.version,
    title: updatedPolicy.title,
    message: `Privacy policy version ${version} updated successfully`,
  };
}

async deletePolicy(version: number): Promise<DeletePolicyResponseDto> {
  // Check if policy exists
  const [existingPolicy] = await db
    .select()
    .from(privacyPolicies)
    .where(eq(privacyPolicies.version, version))
    .limit(1);

  if (!existingPolicy) {
    throw new NotFoundException(`Policy version ${version} not found`);
  }

  // Don't allow deleting active policy
  if (existingPolicy.isActive) {
    throw new BadRequestException('Cannot delete active policy. Deactivate it first.');
  }

  // Delete the policy
  await db
    .delete(privacyPolicies)
    .where(eq(privacyPolicies.version, version));

  return {
    success: true,
    deletedVersion: version,
    message: `Privacy policy version ${version} deleted successfully`,
  };
}

async activatePolicy(version: number): Promise<ActivatePolicyResponseDto> {
  // Check if policy exists
  const [policyToActivate] = await db
    .select()
    .from(privacyPolicies)
    .where(eq(privacyPolicies.version, version))
    .limit(1);

  if (!policyToActivate) {
    throw new NotFoundException(`Policy version ${version} not found`);
  }

  // Deactivate all policies first
  await db
    .update(privacyPolicies)
    .set({ isActive: false })
    .where(eq(privacyPolicies.isActive, true));

  // Activate the specified policy
  const [activatedPolicy] = await db
    .update(privacyPolicies)
    .set({ isActive: true })
    .where(eq(privacyPolicies.version, version))
    .returning();

  return {
    id: activatedPolicy.id,
    version: activatedPolicy.version,
    message: `Privacy policy version ${version} activated successfully`,
  };
}
}

