import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DashboardService } from '../../service/dashboard-service/dashboard.service';
import { AuthService } from '../../service/auth-service/auth.service';
import { NotificationsService } from 'angular2-notifications';
let DashboardPageComponent = class DashboardPageComponent {
    constructor(dashboardService, authService, notificationsService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
        this.notificationsService = notificationsService;
    }
    ngOnInit() {
        this.strategies = this.dashboardService.getAllDashboardStrategies();
        this.selectedStrategy = this.strategies[1];
        this.dashboardWidgetInfos = this.dashboardService.getAllDashboardWidgetInfos();
        const myself = this.authService.myself();
        this.data = this.dashboardService.getUserDashboardLayoutData(myself);
    }
    onDashboardEvent($event) {
        console.log('********** onDashboardEvent', $event);
        this.notificationsService.success('Success', 'testing 123');
        this.notificationsService.info('Info', 'testing 123 asd sid iasdo oais diaosid asd iois iod iaoi dioisd ioiosd ioioaisd iosd');
        this.notificationsService.warn('Warninig', 'testing 123 sioio asdio iosid iosdsd');
        this.notificationsService.error('Error', 'testing 123 iaoisdi aposidiaps diaopsid osidopai sdiosido sido siod sod apidsosipoaidois iudsdis udisudiauisdsiud ');
        /*
        this.dashboardService.saveDashboardLayout($event.serializedData)
            .pipe(
                tap((r: boolean) => {
                    if (r) {
                        this.notificationsService.success(`Success`, `Dashboard layout saved`);
                    } else {
                        this.notificationsService.error(`Error`, `Dashboard layout failed`);
                    }
                })
            ).subscribe();
         */
    }
};
DashboardPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './dashboard.page.html',
        styleUrls: ['./dashboard.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [DashboardService,
        AuthService,
        NotificationsService])
], DashboardPageComponent);
export { DashboardPageComponent };
//# sourceMappingURL=dashboard.page.js.map