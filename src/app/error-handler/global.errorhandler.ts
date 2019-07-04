import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class GlobalErrorhandler extends ErrorHandler {

    constructor(private injector: Injector) {
        super();
    }

    handleError(error: any): void {
        if (error instanceof HttpErrorResponse) { // service call
            if (!navigator.onLine) {
            }
        } else { // client error
        }
        console.error(error);
        const router: Router = this.injector.get(Router);
        router.navigate(['/error']);
    }
}
