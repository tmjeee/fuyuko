import {ResponseStatus, SimpleResponseStatus} from './api-response-status.model';
import {User} from "./user.model";


// this is used in express response
export interface ApiResponse {
   status: ResponseStatus;
   message: string;
}

export interface UserAvatarResponse extends ApiResponse {
   userAvatarId: number;
}

export interface LoginResponse extends ApiResponse{
   jwtToken: string;
   user: User;
   theme: string;
}

export interface RegistrationResponse extends ApiResponse{
   registrationId: number;
   username: string;
   email: string;
}

