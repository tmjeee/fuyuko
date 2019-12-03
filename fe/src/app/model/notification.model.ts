import {ResponseStatus} from './response-status.model';


export interface AppNotification {
  isNew: boolean;
  status: ResponseStatus;
  title: string;
  message: string;
}
