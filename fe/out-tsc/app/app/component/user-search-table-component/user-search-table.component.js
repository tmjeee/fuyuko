import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
class UserSearchTableDataSource {
    constructor() {
        this.subject = new BehaviorSubject([]);
    }
    update(users) {
        this.subject.next(users);
    }
    connect(collectionViewer) {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer) {
        this.subject.complete();
    }
}
let UserSearchTableComponent = class UserSearchTableComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.events = new EventEmitter();
        this.displayedColumns = ['username', 'firstName', 'lastName', 'email', 'actions'];
        this.formControlUserSearch = formBuilder.control('');
        this.dataSource = new UserSearchTableDataSource();
    }
    ngOnInit() {
        if (this.users) {
            this.dataSource.update(this.users);
        }
    }
    onUserSearchTriggered($event) {
        this.userSearchFn(this.formControlUserSearch.value)
            .pipe(map((users) => {
            this.dataSource.update(users);
        })).subscribe();
    }
    onActionTypeClicked($event, actionType, user) {
        this.events.emit({
            type: actionType.type,
            user
        });
    }
    ngOnChanges(changes) {
        const change = changes.users;
        if (this.dataSource) {
            const users = change.currentValue;
            this.dataSource.update(users);
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], UserSearchTableComponent.prototype, "searchFieldPlaceholder", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], UserSearchTableComponent.prototype, "searchFieldLabel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], UserSearchTableComponent.prototype, "searchFieldHint", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], UserSearchTableComponent.prototype, "users", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], UserSearchTableComponent.prototype, "userSearchFn", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], UserSearchTableComponent.prototype, "actionTypes", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], UserSearchTableComponent.prototype, "events", void 0);
UserSearchTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-user-search-table',
        templateUrl: './user-search-table.component.html',
        styleUrls: ['./user-search-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], UserSearchTableComponent);
export { UserSearchTableComponent };
//# sourceMappingURL=user-search-table.component.js.map