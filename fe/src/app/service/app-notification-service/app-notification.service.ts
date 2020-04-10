import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AppNotification, NewNotification} from '../../model/notification.model';
import {User} from '../../model/user.model';
import {AuthService} from '../auth-service/auth.service';
import {map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {ApiResponse} from "../../model/api-response.model";

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
    this.httpClient.post<ApiResponse>(
        URL_POST_CREATE_USER_NOTIFICATION(),
          {userId, n}
        ).pipe(
          tap((r: ApiResponse) => {
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
          .get<ApiResponse<AppNotification[]>>(URL_GET_USER_NOTIFICATIONS()
              .replace(':userId', String(user.id)))
          .pipe(
              map((r: ApiResponse<AppNotification[]>) => r.payload)
          );
  }

  ngOnDestroy(): void {
      if (this.subject) {
        this.subject.complete();
        this.subject = null;
      }
  }
}
