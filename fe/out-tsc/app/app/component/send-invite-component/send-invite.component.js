import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatChipList } from '@angular/material/chips';
import { FormBuilder, Validators } from '@angular/forms';
import { filter, startWith } from 'rxjs/operators';
import { switchMap } from 'rxjs/internal/operators/switchMap';
let SendInviteComponent = class SendInviteComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.selectedGroups = [];
        this.formControlGroup = formBuilder.control('');
        this.formControlEmail = formBuilder.control('', [Validators.required, Validators.email]);
        this.events = new EventEmitter();
    }
    ngOnInit() {
        this.filteredGroups = this.formControlGroup
            .valueChanges
            .pipe(startWith(''), filter((v) => (typeof v === 'string')), switchMap((v) => {
            return this.groupSearchFn(v);
        }));
    }
    onGroupChipRemoved($event) {
        const g = $event.chip.value;
        this.selectedGroups = this.selectedGroups.filter((grp) => grp.id !== g.id);
        this.checkIfAnyGroupsAreSelected();
    }
    onGroupSelected($event) {
        const g = $event.option.value;
        const gFound = this.selectedGroups.find((grp) => grp.id === g.id);
        if (!gFound) {
            this.selectedGroups.push(g);
        }
        this.formControlGroup.setValue('');
        this.checkIfAnyGroupsAreSelected();
    }
    onSendInvitation($event) {
        this.events.emit({
            email: this.formControlEmail.value,
            groups: this.selectedGroups
        });
        this.clearInputs();
    }
    isValid() {
        return (this.formControlEmail.valid && !!this.selectedGroups && this.selectedGroups.length > 0);
    }
    onGroupInputFocus($event) {
        this.checkIfAnyGroupsAreSelected();
    }
    clearInputs() {
        this.chipInput.nativeElement.value = '';
        this.formControlEmail.setValue('');
        this.formControlGroup.setValue('');
        this.formControlEmail.markAsUntouched();
        this.formControlEmail.markAsPristine();
        this.formControlGroup.markAsUntouched();
        this.formControlGroup.markAsPristine();
        this.selectedGroups = [];
        this.formControlEmail.updateValueAndValidity();
        this.formControlGroup.updateValueAndValidity();
    }
    checkIfAnyGroupsAreSelected() {
        if (this.selectedGroups && this.selectedGroups.length <= 0) {
            this.matChipList.errorState = true;
        }
        else {
            this.matChipList.errorState = false;
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], SendInviteComponent.prototype, "groupSearchFn", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], SendInviteComponent.prototype, "events", void 0);
tslib_1.__decorate([
    ViewChild('chipList', { static: true }),
    tslib_1.__metadata("design:type", MatChipList)
], SendInviteComponent.prototype, "matChipList", void 0);
tslib_1.__decorate([
    ViewChild('chipInput', { static: true }),
    tslib_1.__metadata("design:type", ElementRef)
], SendInviteComponent.prototype, "chipInput", void 0);
SendInviteComponent = tslib_1.__decorate([
    Component({
        selector: 'app-send-invite',
        templateUrl: './send-invite.component.html',
        styleUrls: ['./send-invite.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], SendInviteComponent);
export { SendInviteComponent };
//# sourceMappingURL=send-invite.component.js.map