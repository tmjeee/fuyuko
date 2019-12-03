import {User} from './user.model';
import { ResponseStatus } from './response-status.model';

export interface LoginResponse {
    jwtToken: string;
    status: ResponseStatus;
    message: string;
    user: User;
    theme: string;
}
