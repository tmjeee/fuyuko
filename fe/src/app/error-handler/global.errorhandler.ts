import {ErrorHandler, Inject, Injectable, Injector, NgZone} from '@angular/core';
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
                    if (httpErrorResponse.error.context === 'login') { // when trying to login
                    } else {
                        if (!location.href.endsWith('/login-layout/login')) {
                            this.locationHistoryService.storeLastUrlKey(location.href);
                        }
                    }
                    this.getNgZone().run(() => {
                        this.notificationService.error('Unauthorized', httpErrorResponse.error.errors.map((e) => e.msg).join(', '));
                        this.getRouter().navigate(['/login-layout', 'login']);
                    });
                } else if (httpErrorResponse.status === 403) {
                    // forbidden - 403
                    this.notificationService.error('Unauthorized',
                        `Not allowed access to ${httpErrorResponse.url}`);

                } else if (httpErrorResponse.status === 404) { // api service not found??
                    this.notificationService.error('API Service',
                        `unable to find API service ${httpErrorResponse.url}`);
                } else if (httpErrorResponse.status === 400) { // bad request (client error)
                    this.notificationService.error('Client Error',
                        `${this.getErrorMessages(httpErrorResponse)}`);
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

    private getNgZone(): NgZone {
        const ngZone: NgZone = this.injector.get(NgZone);
        return ngZone;
    }

    private getErrorMessages(r: HttpErrorResponse): string {
        if (r.error && r.error.errors && r.error.errors.length > 0) {
            return r.error.errors.reduce((acc: string[], err: {message?: string, msg?: string}) => {
                if (err.message) {
                    acc.push(err.message);
                }
                if (err.msg) {
                    acc.push(err.msg);
                }
                return acc;
            }, [])
            .map((c: string) => c).join('<br/>');
        }
        return null;
    }
}

