import * as tslib_1 from "tslib";
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth-service/auth.service';
import { Injectable } from '@angular/core';
let AuthGuard = class AuthGuard {
    constructor(myAuthService, router) {
        this.myAuthService = myAuthService;
        this.router = router;
    }
    canActivate(route, state) {
        const mySelf = this.myAuthService.myself();
        if (mySelf) {
            return true;
        }
        else {
            return this.router.createUrlTree(['/login-layout', 'login']);
        }
    }
};
AuthGuard = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [AuthService, Router])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map