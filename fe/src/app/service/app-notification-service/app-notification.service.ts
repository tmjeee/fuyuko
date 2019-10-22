import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AppNotification} from '../../model/notification.model';
import {User} from '../../model/user.model';
import {AuthService} from '../auth-service/auth.service';
import {map} from 'rxjs/operators';

@Injectable()
export class AppNotificationService {

  private subject: BehaviorSubject<AppNotification[]>;

  constructor(private authService: AuthService) {
        this.subject = new BehaviorSubject(null);
  }


  asObservable(): Observable<AppNotification[]> {
    return this.subject.asObservable();
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
  }
}
