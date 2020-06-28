
// represents an actual invitation
export interface Invitation {
    id: number;
    email: string;
    creationDate: Date;
    activated: boolean;
}

// response after you activate an invitation
export interface Activation {
    registrationId: number;
    username: string;
    email: string;
    status: 'SUCCESS' | 'ERROR';
    message: string;
}
