import {Group} from './group.model';

export type UserStatus = 'enabled' | 'disabled' | 'deleted';
export interface UserRolesType  {
  [role: string]: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  groups: Group[];
  avatarUrl: string;
  theme: string;
  roles?: UserRolesType;
}

