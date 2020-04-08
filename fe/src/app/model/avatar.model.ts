import {ResponseStatus} from './api-response-status.model';
import {ApiResponse} from "./api-response.model";


export interface GlobalAvatar {
  id: number;
  name: string;
  mimeType: string;
  size: number;
}


export interface UserAvatar {
    global: boolean;
    name: string;
    mimeType: string;
    size: number;
    id: number
}
