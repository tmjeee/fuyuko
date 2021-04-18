
export const ROLE_VIEW = 'VIEW';
export const ROLE_EDIT = 'EDIT';
export const ROLE_PARTNER = 'PARTNER';
export const ROLE_ADMIN = 'ADMIN';

// export type RoleName =  'VIEW' | 'EDIT' | 'PARTNER';
export type RoleName =  string;

export interface Role {
    id: number;
    name: string;
    description: string;
}



