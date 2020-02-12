import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AppNotification, NewNotification} from '../../model/notification.model';
import {User} from '../../model/user.model';
import {AuthService} from '../auth-service/auth.service';
import {map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';

const URL_POST_CREATE_USER_NOTIFICATION = () => `${config().api_host_url}/user/:userId/notification`;
const URL_GET_USER_NOTIFICATIONS = () => `${config().api_host_url}/user/:userId/notifications`;

@Injectable()
export class AppNotificationService implements OnDestroy {

  private subject: BehaviorSubject<AppNotification[]>;

  constructor(private authService: AuthService,
              private httpClient: HttpClient) {
        this.subject = new BehaviorSubject(null);
  }

  asObservable(): Observable<AppNotification[]> {
    return this.subject.asObservable();
  }

  sendNotifications(userId: number, n: NewNotification) {
    this.httpClient.post(
        URL_POST_CREATE_USER_NOTIFICATION(),
          {userId, n}
        ).pipe(
          tap((r: any) => {
        })
    ).subscribe();
  }

  retrieveNotifications(myself: User) {
    this.getUserNotitications(myself)
      .pipe(
        map((n: AppNotification[]) => {
          this.subject.next(n);
        })
      ).subscribe();
  }

  private getUserNotitications(user: User): Observable<AppNotification[]> {
      return this.httpClient
          .get<AppNotification[]>(URL_GET_USER_NOTIFICATIONS()
              .replace(':userId', String(user.id)));
      /*
    return of ([
    {
      isNew: true,
        status: 'ERROR',
      title: `An error ${new Date()}`,
      message: `Some error message ${Math.random()}`
    } as AppNotification,
    {
      isNew: true,
      status: 'WARN',
      title: `A warning ${new Date()}`,
      message: `Some warning message ${Math.random()}`
    } as AppNotification,

    {
      isNew: true,
      status: 'INFO',
      title: `An info ${new Date()}`,
      message: `Some info message ${Math.random()}`
    } as AppNotification,

    {
      isNew: true,
      status: 'SUCCESS',
      title: `A success ${new Date()}`,
      message: `Some success message ${Math.random()}`
    } as AppNotification
    ]);
       */
  }

  ngOnDestroy(): void {
      if (this.subject) {
        this.subject.complete();
        this.subject = null;
      }
  }
}
