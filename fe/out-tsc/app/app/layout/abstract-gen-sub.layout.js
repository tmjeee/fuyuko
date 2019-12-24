import { AbstractGenLayoutComponent } from './abstract-gen.layout';
export class AbstractGenSubLayoutComponent extends AbstractGenLayoutComponent {
    constructor(notificationService, authService, settingsService, route, router) {
        super(notificationService, authService, settingsService, router, route);
        this.subSideBarOpened = this.runtimeSettings.openSubSideNav;
    }
    ngOnInit() {
        super.ngOnInit();
    }
    onSubSidebarButtonClicked($event) {
        this.subSideBarOpened = !this.subSideBarOpened;
    }
}
//# sourceMappingURL=abstract-gen-sub.layout.js.map