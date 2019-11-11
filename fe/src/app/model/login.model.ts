import {User} from './user.model';
import { Status } from './status.model';

export interface LoginResponse {
    jwtToken: string;
    status: Status;
    message: string;
    user: User;
    theme: string;
}
