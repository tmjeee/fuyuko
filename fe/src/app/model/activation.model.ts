
export interface Invitation {
    id: number;
    email: string;
    creationDate: Date;
    activated: boolean;
}

export interface Activation {
    registrationId: number;
    username: string;
    email: string;
    status: 'SUCCESS' | 'ERROR';
    message: string;
}