

export interface RegistrationResponse {
    registrationId: number;
    username: string;
    email: string;
    status: 'SUCCESS' | 'ERROR';
    message: string;
}
