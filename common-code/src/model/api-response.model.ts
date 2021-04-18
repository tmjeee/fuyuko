import {ResponseStatus } from './api-response-status.model';
import {User} from "./user.model";


// this is used in express response
export interface ApiResponse<P=void> {
   messages: {
      status: ResponseStatus;
      message: string;
   }[],
   payload?: P
}

export interface PaginableApiResponse<P=void> extends ApiResponse<P>{
   limit: number;
   offset: number;
   total: number;
}

export interface UserAvatarResponse extends ApiResponse<{userAvatarId: number}> {
}

export interface LoginResponse extends ApiResponse<{jwtToken: string, user: User, theme: string}>{
}

export interface RegistrationResponse extends ApiResponse<{registrationId: number, username: string, email: string}>{
}

export interface ScheduleValidationResponse extends ApiResponse<{validationId: number}> {
}

