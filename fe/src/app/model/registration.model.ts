

export interface Registration {
    registrationId: number;
    username: string;
    email: string;
    status: 'SUCCESS' | 'ERROR';
    message: string;
}
