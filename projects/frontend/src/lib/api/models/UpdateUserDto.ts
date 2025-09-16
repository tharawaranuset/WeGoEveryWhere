/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserDto = {
    telephoneNumber?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    birthdate?: string;
    sex?: UpdateUserDto.sex;
    signupTime?: string;
    signupDate?: string;
};
export namespace UpdateUserDto {
    export enum sex {
        FEMALE = 'female',
        MALE = 'male',
        OTHER = 'other',
        PREFER_NOT = 'prefer_not',
    }
}

