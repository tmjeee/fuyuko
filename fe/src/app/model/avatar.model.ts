import {ResponseStatus} from './response-status.model';


export interface GlobalAvatar {
  id: number;
  name: string;
  mimeType: string;
  size: number;
}

export interface UserAvatarResponse {
  userAvatarId: number;
  message: string;
  status: ResponseStatus;
}
