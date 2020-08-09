import {ErrorHandler, Inject, Injectable, Injector, NgZone} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {BrowserLocationHistoryService} from '../service/browser-location-history-service/browser-location-history.service';
import {ApiErrorContext} from "../model/api-error.model";
import {GlobalCommunicationService} from "../service/global-communication-service/global-communication.service";
import {ApiResponse} from "../model/api-response.model";
import {AuthService, isUnauthorizationFailedRedirectable} from "../service/auth-service/auth.service";
import {LoadingService} from "../service/loading-service/loading.service";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    notificationService: NotificationsService;
    globalCommunicationService: GlobalCommunicationService;
    authService: AuthService;
    loadingService: LoadingService;

    constructor(@Inject(Injector) private injector: Injector,
                private locationHistoryService: BrowserLocationHistoryService) {
        super();
        this.notificationService = this.injector.get(NotificationsService);
        this.globalCommunicationService = this.injector.get(GlobalCommunicationService);
        this.authService = this.injector.get(AuthService);
        this.loadingService = this.injector.get(LoadingService);
    }


    handleError(error: any): void {
        console.error('********************** error', error);
        if (error instanceof HttpErrorResponse) { // service call
            const httpErrorResponse: HttpErrorResponse = error as HttpErrorResponse;
            if (!navigator.onLine) {
                const msg = `Browser offline`;
                this.notificationService.error(`Offline`, msg);
                this.globalCommunicationService.publishGlobalError(msg);
            } else {
                if (httpErrorResponse.status === 0 ) {
                    // api backend is down
                    const msg = `Unable to connect to API services`;
                    this.notificationService.error(`API Service`, `Unable to connect to API services`);
                    this.globalCommunicationService.publishGlobalError(msg);
                } else if (httpErrorResponse.status === 401) {
                    // unauthorized 401
                    this.authService.destroyToken();
                    this.locationHistoryService.storeLastUrlKey(location.href);
                    this.loadingService.stopLoading();
                    if (isUnauthorizationFailedRedirectable(location.href)) {
                        this.getNgZone().run(() => {
                            this.notificationService.error('Unauthorized', httpErrorResponse.error.errors.map((e: {msg: string}) => e.msg).join(', '));
                            this.getRouter().navigate(['/login-layout', 'login']);
                        });
                    }
                } else if (httpErrorResponse.status === 403) {
                    // forbidden - 403
                    const msg = `Not allowed access to  ${httpErrorResponse.url}`
                    this.notificationService.error('Forbidden', msg);
                    this.globalCommunicationService.publishGlobalError(msg);
                    this.loadingService.stopLoading();
                } else if (httpErrorResponse.status === 404) { // api service not found??
                    const msg = `Unable to find API service ${httpErrorResponse.url}`;
                    this.notificationService.error('API Service', msg);
                    this.globalCommunicationService.publishGlobalError(msg);
                    this.loadingService.stopLoading();
                } else if (httpErrorResponse.status === 400) { // bad request (client error)
                    const msg = `${this.getErrorMessages(httpErrorResponse)}`;
                    this.notificationService.error('Client Error', msg);
                    this.globalCommunicationService.publishGlobalError(msg);
                    this.loadingService.stopLoading();
                } else {
                    const msg = `${error.message}`;
                    this.notificationService.error('API Service', msg);
                    this.globalCommunicationService.publishGlobalError(msg);
                    this.loadingService.stopLoading();
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

        // case 1:
        const apiErrorContext: ApiErrorContext = r.error;
        if (apiErrorContext && apiErrorContext.errors && apiErrorContext.errors.length > 0) {
            return apiErrorContext.errors.reduce((acc: string[], err: {message?: string, msg?: string}) => {
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

        // case 2:
        const apiResponse: ApiResponse = r.error;
        if (apiResponse.message && apiResponse.status) {
            return apiResponse.message;
        }

        return null;
    }
}

