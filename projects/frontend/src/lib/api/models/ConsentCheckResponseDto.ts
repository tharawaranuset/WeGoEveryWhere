/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ConsentCheckResponseDto = {
    /**
     * Whether user needs to accept new consent
     */
    consentRequired: boolean;
    /**
     * Current active policy version
     */
    currentVersion: number;
    /**
     * User's accepted policy version
     */
    userVersion: number;
};

