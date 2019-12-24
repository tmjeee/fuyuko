import * as tslib_1 from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
let SideNavComponent = class SideNavComponent {
    constructor(route, router) {
        this.route = route;
        this.router = router;
        this.logoutEvent = new EventEmitter();
    }
    ngOnInit() {
        this.routeSideNavData = this.findSideNavData([this.route.snapshot]);
        this.router.events
            .pipe(filter((e) => e instanceof NavigationEnd), map((e) => {
            this.routeSideNavData = this.findSideNavData([this.route.snapshot]);
        })).subscribe();
    }
    findSideNavData(r) {
        let result = null;
        for (const rr of r) {
            result = rr.data.sideNav;
            if (!result) {
                result = this.findSideNavData(rr.children);
                if (result) {
                    return result;
                }
            }
            else {
                return result;
            }
        }
        return result;
    }
    logout($event) {
        this.logoutEvent.emit(null);
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], SideNavComponent.prototype, "logoutEvent", void 0);
SideNavComponent = tslib_1.__decorate([
    Component({
        selector: 'app-side-nav',
        templateUrl: './side-nav.component.html',
        styleUrls: ['./side-nav.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ActivatedRoute, Router])
], SideNavComponent);
export { SideNavComponent };
//# sourceMappingURL=side-nav.component.js.map