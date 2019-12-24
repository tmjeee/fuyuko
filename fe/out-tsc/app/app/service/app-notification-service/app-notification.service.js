import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { map } from 'rxjs/operators';
let AppNotificationService = class AppNotificationService {
    constructor(authService) {
        this.authService = authService;
        this.subject = new BehaviorSubject(null);
    }
    asObservable() {
        return this.subject.asObservable();
    }
    retrieveNotifications(myself) {
        this.getUserNotitications(myself)
            .pipe(map((n) => {
            this.subject.next(n);
        })).subscribe();
    }
    getUserNotitications(user) {
        return of([
            {
                isNew: true,
                status: 'ERROR',
                title: `An error ${new Date()}`,
                message: `Some error message ${Math.random()}`
            },
            {
                isNew: true,
                status: 'WARN',
                title: `A warning ${new Date()}`,
                message: `Some warning message ${Math.random()}`
            },
            {
                isNew: true,
                status: 'INFO',
                title: `An info ${new Date()}`,
                message: `Some info message ${Math.random()}`
            },
            {
                isNew: true,
                status: 'SUCCESS',
                title: `A success ${new Date()}`,
                message: `Some success message ${Math.random()}`
            }
        ]);
    }
};
AppNotificationService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [AuthService])
], AppNotificationService);
export { AppNotificationService };
//# sourceMappingURL=app-notification.service.js.map