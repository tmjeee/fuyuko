import {SimpleStatus} from './status.model';

export interface SelfRegistration {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    creationDate: Date;
    activated: boolean;
}

export interface SelfRegistrationResponse {
    status: SimpleStatus;
    message: string;
}
