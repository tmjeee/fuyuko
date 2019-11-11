import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../../model/user.model';
import {Themes} from '../theme-service/theme.service';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../../model/login.model';


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
      // todo:
       const token = Math.random(); // todo: jwt token
       if (username === 'tmjee' && password === 'tmjee') {
        const u: User = {
          id: 1,
          email: 'tmjee1@gmail.com',
          groups: [],
          username: 'tmjee',
          firstName: 'Toby',
          lastName: 'Jee',
          avatarUrl: 'assets/images/avatar/avatar-01.png',
          theme: Themes.THEME_PINK_BLUEGREY_LIGHT as any as string
        } as User;

        this.storeToken({
          token: '' + token,
          myself: u
        } as StorageToken);
        this.subject.next(u);
        return of(u);
       }
       return of(null);
  }

  logout(): Observable<void> {
    // todo:
    this.destroyToken();
    this.subject.next(null);
    return of(null);
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
