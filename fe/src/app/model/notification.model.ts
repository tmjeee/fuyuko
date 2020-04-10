import {ResponseStatus} from './api-response-status.model';

export interface NewNotification {
  status: ResponseStatus;
  title: string;
  message: string;
}

export interface AppNotification {
  id: number;
  isNew: boolean;
  status: ResponseStatus;
  title: string;
  message: string;
}
