import {Group} from './group.model';

export type UserStatus = 'enabled' | 'disabled' | 'deleted';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  groups: Group[];
  theme: string;
}

export type UserWithoutGroupAndTheme  = Omit<User, 'groups' | 'theme'>;

