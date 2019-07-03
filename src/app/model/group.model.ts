import {Role} from './role.model';


export type GroupStatus = 'enabled' | 'disabled' | 'deleted';

export interface Group {
  id: number;
  name: string;
  description: string;
  status: GroupStatus;
  roles: Role[];
}
