import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../../model/user.model';
import {Themes} from '../theme-service/theme.service';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../../model/login.model';

import config from '../../../assets/config.json';
import {tap} from 'rxjs/operators';


const URL_LOGIN = `${config.api_host_url}/login`;
const URL_LOGOUT = `${config.api_host_url}/logout`;

export interface StorageToken  {
  token: string;
  myself: User;
}

@Injectable()
export class AuthService {

  private subject: BehaviorSubject<User>;

 constructor(private httpClient: HttpClient) {
   const myself: User = this.myself();
   this.subject = new BehaviorSubject(myself);
 }

 asObservable(): Observable<User> {
   return this.subject.asObservable();
 }

  login(username: string, password: string): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(URL_LOGIN, {
            username, password
        }).pipe(
            tap((r: LoginResponse) => {
                this.storeToken({
                    token: r.jwtToken,
                    myself: r.user
                } as StorageToken);
                this.subject.next(r.user);
            })
        );
  }

  logout(): Observable<void> {
     return this.httpClient.post<void>(`${URL_LOGOUT}`, {
     }).pipe(
         tap((_) => {
             this.destroyToken();
             this.subject.next(null);
         })
     );
  }

  saveMyself(myself: User) {
   // todo:
    const token: StorageToken = JSON.parse(localStorage.getItem('MY_APP_MYSELF'));
    token.myself = myself;
    this.storeToken(token);
    this.subject.next(myself);
  }


  private storeToken(token: StorageToken) {
    localStorage.setItem('MY_APP_MYSELF', JSON.stringify(token));
  }

  private destroyToken() {
    localStorage.removeItem('MY_APP_MYSELF');
  }

  myself(): User {
    const stringifySelf: string = localStorage.getItem('MY_APP_MYSELF');
    if (stringifySelf) {
      const token: StorageToken =  JSON.parse(stringifySelf);
      return token.myself;
    }
    return null;
  }

  savePassword(myself: User, password: string) {
    // todo:
  }
}
