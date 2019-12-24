import * as tslib_1 from "tslib";
import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
let WidgetContainerComponent = class WidgetContainerComponent {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        setTimeout(() => {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dashboardWidgetInstance.type);
            this.componentRef = this.container.createComponent(componentFactory);
        });
    }
    destroy() {
        this.container.clear();
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], WidgetContainerComponent.prototype, "dashboardWidgetInstance", void 0);
tslib_1.__decorate([
    ViewChild('container', { read: ViewContainerRef, static: true }),
    tslib_1.__metadata("design:type", ViewContainerRef)
], WidgetContainerComponent.prototype, "container", void 0);
WidgetContainerComponent = tslib_1.__decorate([
    Component({
        selector: 'app-widget-container',
        templateUrl: './widget-container.component.html',
        styleUrls: ['./widget-container.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ComponentFactoryResolver])
], WidgetContainerComponent);
export { WidgetContainerComponent };
//# sourceMappingURL=widget-container.component.js.map