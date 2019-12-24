import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UserManagementService } from '../../service/user-management-service/user-management.service';
import { debounceTime, filter, startWith } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { switchMap } from 'rxjs/internal/operators/switchMap';
class UserTableDataSource {
    constructor(userManagementService) {
        this.userManagementService = userManagementService;
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
let UserTableComponent = class UserTableComponent {
    constructor(formBuilder, userManagementService) {
        this.formBuilder = formBuilder;
        this.userManagementService = userManagementService;
        this.actions = [];
        this.events = new EventEmitter();
        this.displayedColumns = ['username', 'firstName', 'lastName', 'email', 'actions'];
    }
    ngOnInit() {
        this.dataSource = new UserTableDataSource(this.userManagementService);
        this.dataSource.update(this.users);
        this.userSearchResult = of([]);
        this.formControlUserSearch = this.formBuilder.control('');
        this.userSearchResult = this.formControlUserSearch
            .valueChanges
            .pipe(startWith(''), filter((v) => typeof v === 'string'), debounceTime(500), switchMap((v) => {
            return this.userSearchFn(v);
        }));
    }
    displayFn(user) {
        if (typeof user !== 'string') {
            return user.username;
        }
        return user;
    }
    onUserSearchSelected(event) {
        const user = event.option.value;
        this.events.emit({
            type: 'SELECTION',
            user
        });
        this.formControlUserSearch.setValue('');
    }
    onCancelClicked(event, user) {
        this.events.emit({
            type: 'DELETE', user
        });
    }
    ngOnChanges(changes) {
        if (changes.users) {
            if (this.dataSource) {
                const change = changes.users;
                const users = change.currentValue;
                this.dataSource.update(users);
            }
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], UserTableComponent.prototype, "searchFieldPlaceholder", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], UserTableComponent.prototype, "searchFieldLabel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], UserTableComponent.prototype, "searchFieldHint", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], UserTableComponent.prototype, "actions", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], UserTableComponent.prototype, "users", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], UserTableComponent.prototype, "userSearchFn", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], UserTableComponent.prototype, "events", void 0);
UserTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-user-table',
        templateUrl: './user-table.component.html',
        styleUrls: ['./user-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder, UserManagementService])
], UserTableComponent);
export { UserTableComponent };
//# sourceMappingURL=user-table.component.js.map