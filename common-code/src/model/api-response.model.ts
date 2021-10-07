import {ResponseStatus } from './api-response-status.model';
import {User} from "./user.model";

export interface ApiResponseMessage {
   status: ResponseStatus;
   message?: string;
}

// this is used in express response
export interface ApiResponse<P=void> {
   messages: ApiResponseMessage[],
   payload?: P
}

export interface PaginableApiResponse<P=void> extends ApiResponse<P>{
   limit: number;
   offset: number;
   total: number;
}

export interface UserAvatarResponse extends ApiResponse<{userAvatarId: number} | undefined> {
}

export interface LoginResponse extends ApiResponse<{jwtToken: string, user: User, theme: string}>{
}

export interface RegistrationResponse extends ApiResponse<{registrationId: number, username: string, email: string}>{
}

export interface ScheduleValidationResponse extends ApiResponse<{validationId: number} | undefined> {
}

