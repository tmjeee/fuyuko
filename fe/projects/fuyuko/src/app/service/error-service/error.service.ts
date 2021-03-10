import {Injectable} from '@angular/core';
import {Router, Event, NavigationError} from '@angular/router';
import {tap} from 'rxjs/operators';


@Injectable()
export class ErrorService {
    constructor(private router: Router) {
        this.router.events.pipe(
            tap((e: Event) => {
                if (e instanceof NavigationError)  {
                    if (!navigator.onLine) {
                    }
                    this.router.navigate(['/error']);
                }
            })
        ).subscribe();

    }
}
