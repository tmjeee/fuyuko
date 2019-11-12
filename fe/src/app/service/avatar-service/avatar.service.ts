import {Injectable} from '@angular/core';
import {GlobalAvatar} from '../../model/avatar.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import config from '../../../assets/config.json';

const URL_ALL_GLOBAL_AVATARS = `${config.api_host_url}/global/avatars`;

@Injectable()
export class AvatarService {

  constructor(private httpClient: HttpClient) { }


  allPredefinedAvatars(): Observable<GlobalAvatar[]> {
      return this.httpClient.get<GlobalAvatar[]>(URL_ALL_GLOBAL_AVATARS);
  }
}
