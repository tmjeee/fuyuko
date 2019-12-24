import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ThemeService, ALL_THEMES } from './service/theme-service/theme.service';
import { map } from 'rxjs/operators';
import { OverlayContainer } from '@angular/cdk/overlay';
let AppComponent = class AppComponent {
    constructor(themeService, overlayContainer) {
        this.themeService = themeService;
        this.overlayContainer = overlayContainer;
    }
    ngOnInit() {
        this.themeSubscription = this.themeService.observer()
            .pipe(map((theme) => {
            this.theme = theme;
            // add theme class to overlay container (eg. dialog);
            const overlayContainerHTMLElement = this.overlayContainer.getContainerElement();
            ALL_THEMES.forEach((t) => {
                overlayContainerHTMLElement.classList.remove(t.cssClassName);
            });
            overlayContainerHTMLElement.classList.add(theme.cssClassName);
        })).subscribe();
    }
    ngOnDestroy() {
        if (this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }
};
AppComponent = tslib_1.__decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ThemeService, OverlayContainer])
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map