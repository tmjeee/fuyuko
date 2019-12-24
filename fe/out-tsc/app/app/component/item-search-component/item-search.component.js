import * as tslib_1 from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
let ItemSearchComponent = class ItemSearchComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.events = new EventEmitter();
        this.formControlValue = formBuilder.control('', [Validators.required]);
    }
    onBasicSearch($event) {
        if (this.formControlValue.invalid) {
            this.events.emit({
                type: 'basic',
                search: this.formControlValue.value
            });
        }
    }
    onAdvanceSearch($event) {
        if (this.formControlValue.invalid) {
            this.events.emit({
                type: 'advance',
                search: this.formControlValue.value
            });
        }
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ItemSearchComponent.prototype, "events", void 0);
ItemSearchComponent = tslib_1.__decorate([
    Component({
        selector: 'app-item-search',
        templateUrl: './item-search.component.html',
        styleUrls: ['./item-search.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], ItemSearchComponent);
export { ItemSearchComponent };
//# sourceMappingURL=item-search.component.js.map