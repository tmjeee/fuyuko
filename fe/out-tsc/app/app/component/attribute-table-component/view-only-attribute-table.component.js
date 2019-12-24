import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
export class InternalDataSource extends DataSource {
    connect(collectionViewer) {
        if (!this.subject) {
            this.subject = new BehaviorSubject([]);
        }
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        if (this.subject) {
            this.subject.unsubscribe();
        }
        this.subject = undefined;
    }
    update(attributes) {
        this.subject.next(attributes);
    }
}
let ViewOnlyAttributeTableComponent = class ViewOnlyAttributeTableComponent {
    constructor() {
        this.dataSource = new InternalDataSource();
    }
    ngOnInit() {
        this.dataSource.update(this.attributes);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ViewOnlyAttributeTableComponent.prototype, "attributes", void 0);
ViewOnlyAttributeTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-view-only-attribute-table',
        templateUrl: './view-only-attribute-table.component.html',
        styleUrls: ['./view-only-attribute-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], ViewOnlyAttributeTableComponent);
export { ViewOnlyAttributeTableComponent };
//# sourceMappingURL=view-only-attribute-table.component.js.map