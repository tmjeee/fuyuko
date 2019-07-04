import {Injectable} from '@angular/core';
import {Router, Event, NavigationError} from '@angular/router';
import {map, tap} from 'rxjs/operators';


@Injectable()
export class ErrorService {
    constructor(private router: Router) {
        this.router.events.pipe(
            tap((e: Event) => {
                if (event instanceof NavigationError)  {
                    if (!navigator.onLine) {
                    }
                    this.router.navigate(['/error']);
                }
            })
        ).subscribe();

    }
}
