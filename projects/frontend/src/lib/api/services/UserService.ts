/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static userControllerUpdate(
        requestBody: UpdateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/edit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static userControllerGetall(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static userControllerGetMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
        });
    }
}
