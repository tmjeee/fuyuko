import {Injectable} from '@angular/core';
import {GlobalAvatar, UserAvatarResponse} from '../../model/avatar.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import config from '../../../assets/config.json';

const URL_ALL_GLOBAL_AVATARS = `${config.api_host_url}/global/avatars`;
const URL_SAVE_USER_AVATAR = `${config.api_host_url}/user/avatar`;

@Injectable()
export class AvatarService {

  constructor(private httpClient: HttpClient) { }

  saveUserCustomAvatar(f: File): Observable<UserAvatarResponse> {
     const formData: FormData = new FormData();
     formData.set('customAvatarFile', f);
     return this.httpClient.post<UserAvatarResponse>(URL_SAVE_USER_AVATAR, formData);
  }

  saveUserAvatar(globalAvatarName: string): Observable<UserAvatarResponse> {
      const formData: FormData = new FormData();
      formData.set('globalAvatarName', globalAvatarName);
      return this.httpClient.post<UserAvatarResponse>(URL_SAVE_USER_AVATAR, formData);
  }

  allPredefinedAvatars(): Observable<GlobalAvatar[]> {
      return this.httpClient.get<GlobalAvatar[]>(URL_ALL_GLOBAL_AVATARS);
  }
}
