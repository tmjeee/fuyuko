import {ErrorHandler, Inject, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class GlobalErrorhandler extends ErrorHandler {

    notificationService: NotificationsService;

    constructor(@Inject(Injector) private injector: Injector) {
        super();
        this.notificationService = this.injector.get(NotificationsService);
    }

    handleError(error: any): void {
        if (error instanceof HttpErrorResponse) { // service call
            const httpErrorResponse : HttpErrorResponse = error as HttpErrorResponse;
            if (!navigator.onLine) {
                this.notificationService.error(`Offline`, `Browser offline`);
            } else {
                if (httpErrorResponse.status === 0 ) {
                    // api backend is down
                    this.notificationService.error(`API Service`, `Unable to connect to API services`);
                }
            }
            console.error(error);
        } else { // client error
            console.error(error);
            const router: Router = this.injector.get(Router);
            router.navigate(['/error']);
        }
    }
}
