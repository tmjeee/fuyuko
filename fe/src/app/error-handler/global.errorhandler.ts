import {ErrorHandler, Inject, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {BrowserLocationHistoryService} from '../service/browser-location-history-service/browser-location-history.service';

@Injectable()
export class GlobalErrorhandler extends ErrorHandler {

    notificationService: NotificationsService;

    constructor(@Inject(Injector) private injector: Injector,
                private locationHistoryService: BrowserLocationHistoryService) {
        super();
        this.notificationService = this.injector.get(NotificationsService);
    }

    handleError(error: any): void {
        console.error('********************** error', error);
        if (error instanceof HttpErrorResponse) { // service call
            const httpErrorResponse: HttpErrorResponse = error as HttpErrorResponse;
            if (!navigator.onLine) {
                this.notificationService.error(`Offline`, `Browser offline`);
            } else {
                if (httpErrorResponse.status === 0 ) {
                    // api backend is down
                    this.notificationService.error(`API Service`, `Unable to connect to API services`);
                } else if (httpErrorResponse.status === 401) {
                    // unauthorized 401
                    this.locationHistoryService.storeLastUrlKey(location.href);
                    location.href = '/login-layout/login';
                    return;
                } else if (httpErrorResponse.status === 403) {
                    // forbidden - 403
                    this.notificationService.error('Unauthorized',
                        `Not allowed access to ${httpErrorResponse.url}`);

                } else if (httpErrorResponse.status === 404) { // api service not found??
                    this.notificationService.error('API Service',
                        `unable to find API service ${httpErrorResponse.url}`);
                } else {
                    this.notificationService.error('API Service',
                        `${error.message}`);
                }
            }
        } else { // client error
            console.error(error);
            this.getRouter().navigate(['/error']);
        }
    }

    private getRouter(): Router {
        const router: Router = this.injector.get(Router);
        return router;
    }
}

