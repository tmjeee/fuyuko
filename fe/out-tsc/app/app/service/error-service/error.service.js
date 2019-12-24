import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { tap } from 'rxjs/operators';
let ErrorService = class ErrorService {
    constructor(router) {
        this.router = router;
        this.router.events.pipe(tap((e) => {
            if (event instanceof NavigationError) {
                if (!navigator.onLine) {
                }
                this.router.navigate(['/error']);
            }
        })).subscribe();
    }
};
ErrorService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [Router])
], ErrorService);
export { ErrorService };
//# sourceMappingURL=error.service.js.map