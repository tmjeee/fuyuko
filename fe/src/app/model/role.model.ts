import {SimpleStatus} from "./status.model";


export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface DeleteRoleFromGroupResponse {
    status: SimpleStatus,
    message: string;
    entriesDeleted: number;
}


