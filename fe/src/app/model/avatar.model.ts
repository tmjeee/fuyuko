import {Status} from './status.model';


export interface GlobalAvatar {
  id: number;
  name: string;
  mimeType: string;
  size: number;
}

export interface UserAvatarResponse {
  userAvatarId: number;
  message: string;
  status: Status;
}
