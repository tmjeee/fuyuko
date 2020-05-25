import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../../model/user.model';
import {ThemeService} from '../theme-service/theme.service';
import {HttpClient} from '@angular/common/http';

import config from '../../utils/config.util';
import {delay, map, tap} from 'rxjs/operators';
import {BrowserLocationHistoryService} from "../browser-location-history-service/browser-location-history.service";
import {ApiResponse, LoginResponse} from "../../model/api-response.model";


const URL_LOGIN = () => `${config().api_host_url}/login`;
const URL_LOGOUT = () => `${config().api_host_url}/logout`;
const URL_SAVE_USER = () => `${config().api_host_url}/user`;
const URL_POST_FORGOT_PASSWORD = () => `${config().api_host_url}/forgot-password`;
const URL_POST_FORGOT_PASSWORD_RESET = () => `${config().api_host_url}/forgot-password/code/:code/reset`;
const URL_POST_FORGOT_PASSWORD_CHECK_CODE = () => `${config().api_host_url}/forgot-password/code/:code/validity`;

export const KEY = `MY_APP_MYSELF`;

export interface StorageToken  {
  token: string;
  myself: User;
}


export const isUnauthorizationFailedRedirectable = (url: string): boolean => {
    return (
        (!url.endsWith('/login')) &&
        (!url.endsWith('/register')) &&
        (!url.endsWith('/forgot-password')) &&
        (!url.match(/\/activate\/.*$/))
    );
};




@Injectable()
export class AuthService {

  private subject: BehaviorSubject<User>;

 constructor(private httpClient: HttpClient,
             private browserLocationHistoryService: BrowserLocationHistoryService,
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
                    token: r.payload.jwtToken,
                    myself: r.payload.user
                } as StorageToken);
                this.subject.next(r.payload.user);
            })
        );
  }

  logout(): Observable<ApiResponse> {
     return this.httpClient.post<ApiResponse>(`${URL_LOGOUT()}`, {
     }).pipe(
         tap((x: ApiResponse) => {
             this.browserLocationHistoryService.clearStoredLastUrl();
             this.destroyToken();
             this.subject.next(null);
         })
     );
  }

  saveMyself(myself: User): Observable<User> {
    return this.httpClient.post<ApiResponse<User>>(URL_SAVE_USER(), {
        userId: myself.id,
        firstName: myself.firstName,
        lastName: myself.lastName,
        email: myself.email
    }).pipe(
        map((r: ApiResponse<User>) => r.payload),
        tap((u: User) => this.afterSaveCallback(u))
    );
  }

  saveTheme(myself: User, theme: string): Observable<User> {
    return this.httpClient.post<ApiResponse<User>>(URL_SAVE_USER(), {
        userId: myself.id,
        theme
    }).pipe(
        map((r: ApiResponse<User>) => r.payload),
        tap(this.afterSaveCallback.bind(this) as (u: User) => void)
    );
  }

  savePassword(myself: User, password: string) {
      return this.httpClient.post<ApiResponse<User>>(URL_SAVE_USER(), {
          userId: myself.id,
          password
      }).pipe(
          map((r: ApiResponse<User>) => r.payload),
          tap(this.afterSaveCallback.bind(this) as (u: User) => void)
      );
  }
  private afterSaveCallback(u: User) {
      const token: StorageToken = JSON.parse(localStorage.getItem(KEY));
      token.myself = u;
      this.storeToken(token);
      this.subject.next(u);
  }

  private storeToken(token: StorageToken) {
    localStorage.setItem(KEY, JSON.stringify(token));
  }

  destroyToken() {
    localStorage.removeItem(KEY);
  }

  jwtToken(): string {
      const storageToken: string = localStorage.getItem(KEY);
      if (storageToken) {
          const token: StorageToken =  JSON.parse(storageToken);
          return token.token;
      }
      return null;
  }

  myself(): User {
    const storageToken: string = localStorage.getItem(KEY);
    if (storageToken) {
      const token: StorageToken =  JSON.parse(storageToken);
      return token.myself;
    }
    return null;
  }

  forgotPassword(i: {username?: string, email?: string}): Observable<ApiResponse> {
     return this.httpClient.post<ApiResponse>(URL_POST_FORGOT_PASSWORD(), {
         username: i.username,
         email: i.email
     });
  }

  forgotPasswordReset(code: string, password: string) {
     return this.httpClient.post<ApiResponse>(URL_POST_FORGOT_PASSWORD_RESET().replace(':code', code), {
         password
     });
  }

  forgotPasswordCheck(code: string): Observable<ApiResponse<boolean>> {
     return this.httpClient.post<ApiResponse<boolean>>(URL_POST_FORGOT_PASSWORD_CHECK_CODE().replace(':code', code), {});
  }

}
