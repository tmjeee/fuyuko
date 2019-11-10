import {GroupStatus} from './group.model';


export interface CreateInvitationResponse {
   status: 'ERROR' | 'SUCCESS';
   message: string;
}


export interface Invitation {
   id: number;
   email: string;
   creationDate: Date;
   activated: boolean;
   groupIds: number[];
}

