import {Role} from './role.model';
import {Paginable} from "./pagnination.model";


export type GroupStatus = 'enabled' | 'disabled' | 'deleted';

export interface Group {
  id: number;
  name: string;
  description: string;
  status: GroupStatus;
  roles: Role[];
}

export interface GetGroupsResponse extends Paginable<Group> {
}

