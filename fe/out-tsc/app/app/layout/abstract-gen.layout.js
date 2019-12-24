import { NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
export class AbstractGenLayoutComponent {
    constructor(notificationService, authService, settingsService, router, route) {
        this.notificationService = notificationService;
        this.authService = authService;
        this.settingsService = settingsService;
        this.router = router;
        this.route = route;
        this.runtimeSettings = this.settingsService.getLocalRuntimeSettings();
        this.helpNavOpened = this.runtimeSettings.openHelpNav;
        this.sideNavOpened = this.runtimeSettings.openSideNav;
    }
    ngOnInit() {
        this.routeSubSideNavData = this.findSubSideNavData([this.route.snapshot]);
        this.routerEventSubscription = this.router.events
            .pipe(filter((e) => e instanceof NavigationEnd), map((e) => {
            this.routeSubSideNavData = this.findSubSideNavData([this.route.snapshot]);
        })).subscribe();
        this.authServiceSubscription = this.authService.asObservable()
            .pipe(map((p) => {
            this.myself = p;
            this.notificationService.retrieveNotifications(this.myself);
        })).subscribe();
        this.notificationServiceSubscription = this.notificationService.asObservable()
            .pipe(map((n) => {
            this.notifications = n;
        })).subscribe();
    }
    ngOnDestroy() {
        if (this.routerEventSubscription) {
            this.routerEventSubscription.unsubscribe();
        }
        if (this.authServiceSubscription) {
            this.authServiceSubscription.unsubscribe();
        }
        if (this.notificationServiceSubscription) {
            this.notificationServiceSubscription.unsubscribe();
        }
    }
    onSideNavExpandCollapseButtonClicked(event) {
        this.sideNavOpened = !this.sideNavOpened;
    }
    onHelpNavExpandCollapseButtonClicked(event) {
        this.helpNavOpened = !this.helpNavOpened;
    }
    onNotificationClicked(event) {
    }
    logout() {
        this.authService
            .logout()
            .pipe(map((_) => {
            this.router.navigate(['/login-layout', 'login']);
        })).subscribe();
    }
    findSubSideNavData(r) {
        let result = null;
        for (const rr of r) {
            result = rr.data.subSideNav;
            if (!result) {
                result = this.findSubSideNavData(rr.children);
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
}
//# sourceMappingURL=abstract-gen.layout.js.map