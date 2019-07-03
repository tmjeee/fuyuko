import {Status} from './status.model';


export interface AppNotification {
  isNew: boolean;
  status: Status;
  title: string;
  message: string;
}
