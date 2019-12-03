import {SimpleResponseStatus} from './response-status.model';


export interface ApiResponse {
   status: SimpleResponseStatus;
   message: string;
}
