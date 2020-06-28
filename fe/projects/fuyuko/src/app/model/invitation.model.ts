
export interface Invitation {
   id: number;
   email: string;
   creationDate: Date;
   activated: boolean;
   groupIds: number[];
}

