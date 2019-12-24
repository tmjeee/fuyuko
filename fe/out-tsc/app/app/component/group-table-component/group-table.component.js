import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { debounceTime, filter, startWith } from 'rxjs/operators';
export const SEARCH_ACTION_TYPE = 'SEARCH';
let GroupTableComponent = class GroupTableComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.displayedColumns = ['name', 'description', 'status'];
        this.dataSource = new GroupTableComponentDataSource();
        this.formControlGroupSearch = formBuilder.control('');
        this.actions = [];
        this.events = new EventEmitter();
    }
    ngOnInit() {
        this.dataSource.update(this.groups);
        this.groupSearchResult = this.formControlGroupSearch
            .valueChanges
            .pipe(startWith(''), filter((groupSearch) => (typeof groupSearch === 'string')), debounceTime(1000), switchMap((groupSearch) => {
            return this.groupSearchFn(groupSearch);
        }));
    }
    displayFn(group) {
        if (typeof group === 'string') {
            return group;
        }
        return group.name;
    }
    onGroupSearchSelected(event) {
        const group = event.option.value;
        this.events.emit({
            type: SEARCH_ACTION_TYPE,
            group
        });
        this.formControlGroupSearch.setValue('');
    }
    ngOnChanges(changes) {
        if (changes.groups) {
            const simpleChange = changes.groups;
            const g = simpleChange.currentValue;
            this.dataSource.update(g);
        }
    }
    onActionClicked($event, group, action) {
        this.events.emit({
            type: action.type,
            group
        });
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], GroupTableComponent.prototype, "searchFieldPlaceholder", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], GroupTableComponent.prototype, "searchFieldHint", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], GroupTableComponent.prototype, "searchFieldLabel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], GroupTableComponent.prototype, "groups", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], GroupTableComponent.prototype, "groupSearchFn", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], GroupTableComponent.prototype, "actions", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], GroupTableComponent.prototype, "events", void 0);
GroupTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-group-table',
        templateUrl: './group-table.component.html',
        styleUrls: ['./group-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], GroupTableComponent);
export { GroupTableComponent };
class GroupTableComponentDataSource extends DataSource {
    constructor() {
        super(...arguments);
        this.subject = new BehaviorSubject([]);
    }
    update(g) {
        this.subject.next(g);
    }
    connect(collectionViewer) {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        this.subject.complete();
    }
}
//# sourceMappingURL=group-table.component.js.map