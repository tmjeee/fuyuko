import {Role} from './role.model';
import {Status} from './status.model';

export const GROUP_VIEW = 'VIEW Group';
export const GROUP_EDIT = 'EDIT Group';
export const GROUP_ADMIN = 'ADMIN Group';
export const GROUP_PARTNER = 'PARTNER Group';

export interface Group {
  id: number;
  name: string;
  description: string;
  status: Status;
  roles: Role[];
}

