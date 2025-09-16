/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcceptConsentDto } from '../models/AcceptConsentDto';
import type { AcceptConsentResponseDto } from '../models/AcceptConsentResponseDto';
import type { ActivatePolicyResponseDto } from '../models/ActivatePolicyResponseDto';
import type { ConsentCheckResponseDto } from '../models/ConsentCheckResponseDto';
import type { CreatePolicyDto } from '../models/CreatePolicyDto';
import type { CreatePolicyResponseDto } from '../models/CreatePolicyResponseDto';
import type { DeletePolicyResponseDto } from '../models/DeletePolicyResponseDto';
import type { PolicyHistoryResponseDto } from '../models/PolicyHistoryResponseDto';
import type { PolicyResponseDto } from '../models/PolicyResponseDto';
import type { UpdatePolicyDto } from '../models/UpdatePolicyDto';
import type { UpdatePolicyResponseDto } from '../models/UpdatePolicyResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConsentManagementService {
    /**
     * Get current active privacy policy
     * @returns PolicyResponseDto Current privacy policy
     * @throws ApiError
     */
    public static consentControllerGetCurrentPolicy(): CancelablePromise<PolicyResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/consent/current-policy',
            errors: {
                404: `No active policy found`,
            },
        });
    }
    /**
     * Check if user needs to accept new consent
     * @param userId User ID (number)
     * @returns ConsentCheckResponseDto Consent status check
     * @throws ApiError
     */
    public static consentControllerCheckConsentStatus(
        userId: string,
    ): CancelablePromise<ConsentCheckResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/consent/check/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Accept privacy policy consent
     * @param requestBody
     * @returns AcceptConsentResponseDto Consent accepted successfully
     * @throws ApiError
     */
    public static consentControllerAcceptConsent(
        requestBody: AcceptConsentDto,
    ): CancelablePromise<AcceptConsentResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/consent/accept',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid policy version or user not found`,
            },
        });
    }
    /**
     * Create new privacy policy (Admin only)
     * @param requestBody
     * @returns CreatePolicyResponseDto Policy created successfully
     * @throws ApiError
     */
    public static consentControllerCreatePolicy(
        requestBody: CreatePolicyDto,
    ): CancelablePromise<CreatePolicyResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/consent/admin/policy',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid policy data`,
            },
        });
    }
    /**
     * Get all privacy policy versions
     * @returns PolicyHistoryResponseDto Policy history
     * @throws ApiError
     */
    public static consentControllerGetPolicyHistory(): CancelablePromise<PolicyHistoryResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/consent/policies/history',
        });
    }
    /**
     * Get specific policy by version
     * @param version Policy version number
     * @returns PolicyResponseDto Policy found
     * @throws ApiError
     */
    public static consentControllerGetPolicyByVersion(
        version: string,
    ): CancelablePromise<PolicyResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/consent/policy/{version}',
            path: {
                'version': version,
            },
            errors: {
                404: `Policy not found`,
            },
        });
    }
    /**
     * Update existing privacy policy (Admin only)
     * @param version Policy version to update
     * @param requestBody
     * @returns UpdatePolicyResponseDto Policy updated successfully
     * @throws ApiError
     */
    public static consentControllerUpdatePolicy(
        version: string,
        requestBody: UpdatePolicyDto,
    ): CancelablePromise<UpdatePolicyResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/consent/admin/policy/{version}',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cannot update active policy`,
                404: `Policy not found`,
            },
        });
    }
    /**
     * Delete privacy policy (Admin only)
     * @param version Policy version to delete
     * @returns DeletePolicyResponseDto Policy deleted successfully
     * @throws ApiError
     */
    public static consentControllerDeletePolicy(
        version: string,
    ): CancelablePromise<DeletePolicyResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/consent/admin/policy/{version}',
            path: {
                'version': version,
            },
            errors: {
                400: `Cannot delete active policy`,
                404: `Policy not found`,
            },
        });
    }
    /**
     * Activate specific policy version (Admin only)
     * @param version Policy version to activate
     * @returns ActivatePolicyResponseDto Policy activated successfully
     * @throws ApiError
     */
    public static consentControllerActivatePolicy(
        version: string,
    ): CancelablePromise<ActivatePolicyResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/consent/admin/policy/{version}/activate',
            path: {
                'version': version,
            },
            errors: {
                404: `Policy not found`,
            },
        });
    }
}
