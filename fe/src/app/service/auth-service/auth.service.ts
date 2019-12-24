import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../../model/user.model';
import {Themes, ThemeService} from '../theme-service/theme.service';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../../model/login.model';

import config from '../../utils/config.util';
import {tap} from 'rxjs/operators';


const URL_LOGIN = () => `${config().api_host_url}/login`;
const URL_LOGOUT = () => `${config().api_host_url}/logout`;
const URL_SAVE_USER = () => `${config().api_host_url}/user`;

export interface StorageToken  {
  token: string;
  myself: User;
}

@Injectable()
export class AuthService {

  private subject: BehaviorSubject<User>;

 constructor(private httpClient: HttpClient,
             private themeService: ThemeService) {
   const myself: User = this.myself();
   this.subject = new BehaviorSubject(myself);
 }

 asObservable(): Observable<User> {
   return this.subject.asObservable();
 }

  login(username: string, password: string): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(URL_LOGIN(), {
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
     return this.httpClient.post<void>(`${URL_LOGOUT()}`, {
     }).pipe(
         tap((_) => {
             this.destroyToken();
             this.subject.next(null);
         })
     );
  }

  saveMyself(myself: User): Observable<User> {
    return this.httpClient.post<User>(URL_SAVE_USER(), {
        userId: myself.id,
        firstName: myself.username,
        lastName: myself.lastName,
        email: myself.email
    }).pipe(
        tap(this.afterSaveCallback.bind(this))
    );
  }

  saveTheme(theme: string): Observable<User> {
    return this.httpClient.post<User>(URL_SAVE_USER(), {
        theme
    }).pipe(
        tap(this.afterSaveCallback.bind(this))
    );
  }

  savePassword(myself: User, password: string) {
      return this.httpClient.post<User>(URL_SAVE_USER(), {
          password
      }).pipe(
          tap(this.afterSaveCallback.bind(this))
      );
  }
  private afterSaveCallback(u: User) {
      const token: StorageToken = JSON.parse(localStorage.getItem('MY_APP_MYSELF'));
      token.myself = u;
      this.storeToken(token);
      this.subject.next(u);
  }

  private storeToken(token: StorageToken) {
    localStorage.setItem('MY_APP_MYSELF', JSON.stringify(token));
  }

  destroyToken() {
    localStorage.removeItem('MY_APP_MYSELF');
  }

  jwtToken(): string {
      const storageToken: string = localStorage.getItem('MY_APP_MYSELF');
      if (storageToken) {
          const token: StorageToken =  JSON.parse(storageToken);
          return token.token;
      }
      return null;
  }

  myself(): User {
    const storageToken: string = localStorage.getItem('MY_APP_MYSELF');
    if (storageToken) {
      const token: StorageToken =  JSON.parse(storageToken);
      return token.myself;
    }
    return null;
  }

}
