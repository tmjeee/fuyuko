import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as uuid from 'uuid/v1';
import { WidgetContainerComponent } from './widget-container.component';
let DashboardComponent = class DashboardComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.events = new EventEmitter();
    }
    ngOnInit() {
        this.formControlDashboardStrategySelected = this.formBuilder.control(this.initialStrategy, [Validators.required]);
        this.formControlWidgetInfoSelected = this.formBuilder.control(undefined);
        this.columnIndexes = this.getCurrentStrategy().columnIndexes();
        this.prevStrategy = this.initialStrategy;
        if (this.data) {
            this.getCurrentStrategy().deserialize(this.data);
        }
    }
    onDashboardStrategySelectionChanged($event) {
        console.log('***** onDashboardStrategySelectionChanged');
        const d = this.prevStrategy.serialize();
        console.log('current strategy', this.getCurrentStrategy());
        console.log('&&&&& d', d);
        this.setCurrentStrategy($event.value);
        this.columnIndexes = this.getCurrentStrategy().columnIndexes();
        this.getCurrentStrategy().deserialize(d);
        this.prevStrategy = this.getCurrentStrategy();
    }
    setCurrentStrategy(dashboardStrategy) {
        this.formControlDashboardStrategySelected.setValue(dashboardStrategy);
    }
    getCurrentStrategy() {
        return this.formControlDashboardStrategySelected.value;
    }
    onDashboardWidgetInfoSelectionChanged($event) {
        const selectedDashboardWidgetInfo = $event.value;
        this.getCurrentStrategy().addDashboardWidgetInstances([{
                instanceId: uuid(),
                typeId: selectedDashboardWidgetInfo.id,
            }]);
        this.formControlWidgetInfoSelected.setValue(undefined);
    }
    getDashboardWidgetInstancesForColumn(columnIndex) {
        return this.getCurrentStrategy().getDashboardWidgetInstancesForColumn(columnIndex);
    }
    onDrop($event) {
        if ($event.container === $event.previousContainer) {
            moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
        }
        else {
            transferArrayItem($event.previousContainer.data, $event.container.data, $event.previousIndex, $event.currentIndex);
        }
    }
    saveDashboardLayout($event) {
        const data = this.getCurrentStrategy().serialize();
        this.events.emit({ serializedData: data });
    }
    onCloseWidget($event, widgetInstance) {
        console.log('******* close', widgetInstance);
        const c = this.widgetContainers.find((comp) => {
            return comp.dashboardWidgetInstance.instanceId === widgetInstance.instanceId;
        });
        if (c) {
            c.destroy();
        }
        const itemFound = this.widgetPanels.find((item) => {
            const element = item.element.nativeElement;
            const id = element.getAttribute('instanceId');
            return id === widgetInstance.instanceId;
        });
        console.log(itemFound);
        if (itemFound) {
            itemFound.clear();
            const htmlElement = itemFound.element.nativeElement;
            htmlElement.parentElement.removeChild(htmlElement);
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], DashboardComponent.prototype, "strategies", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DashboardComponent.prototype, "initialStrategy", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], DashboardComponent.prototype, "dashboardWidgetInfos", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DashboardComponent.prototype, "data", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DashboardComponent.prototype, "events", void 0);
tslib_1.__decorate([
    ViewChildren('widgetPanel', { read: ViewContainerRef }),
    tslib_1.__metadata("design:type", QueryList)
], DashboardComponent.prototype, "widgetPanels", void 0);
tslib_1.__decorate([
    ViewChildren('widgetContainer', { read: WidgetContainerComponent }),
    tslib_1.__metadata("design:type", QueryList)
], DashboardComponent.prototype, "widgetContainers", void 0);
DashboardComponent = tslib_1.__decorate([
    Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], DashboardComponent);
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map