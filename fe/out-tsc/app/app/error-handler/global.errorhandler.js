import * as tslib_1 from "tslib";
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
let GlobalErrorhandler = class GlobalErrorhandler extends ErrorHandler {
    constructor(injector) {
        super();
        this.injector = injector;
        this.notificationService = this.injector.get(NotificationsService);
    }
    handleError(error) {
        console.log('********************** error', error);
        if (error instanceof HttpErrorResponse) { // service call
            const httpErrorResponse = error;
            if (!navigator.onLine) {
                this.notificationService.error(`Offline`, `Browser offline`);
            }
            else {
                if (httpErrorResponse.status === 0) {
                    // api backend is down
                    this.notificationService.error(`API Service`, `Unable to connect to API services`);
                }
                else if (httpErrorResponse.status === 401) {
                    // unauthorized 401
                    location.href = '/login-layout/login';
                    return;
                }
                else if (httpErrorResponse.status === 404) { // api service not found??
                    this.notificationService.error('API Service', `unable to find API service ${httpErrorResponse.url}`);
                }
            }
        }
        else { // client error
            console.error(error);
            this.getRouter().navigate(['/error']);
        }
    }
    getRouter() {
        const router = this.injector.get(Router);
        return router;
    }
};
GlobalErrorhandler = tslib_1.__decorate([
    Injectable(),
    tslib_1.__param(0, Inject(Injector)),
    tslib_1.__metadata("design:paramtypes", [Injector])
], GlobalErrorhandler);
export { GlobalErrorhandler };
//# sourceMappingURL=global.errorhandler.js.map