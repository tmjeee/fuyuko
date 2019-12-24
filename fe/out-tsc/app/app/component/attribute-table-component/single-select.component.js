import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export const uniqueKeyValidator = (currentPair, pairs, formGroup) => (c) => {
    const count = pairs.filter((p) => {
        const v = (currentPair.id !== p.id && formGroup.get(`k-${p.id}`) && formGroup.get(`k-${p.id}`).value === c.value);
        return v;
    }).length;
    if (count > 0) {
        return { uniqueKey: true };
    }
    return null;
};
let SingleSelectComponent = class SingleSelectComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.counter = -1;
        this.pairs = [];
    }
    ngOnInit() {
        this.pairs = this.pairs ? [...this.pairs] : [];
        this.formGroup = this.formBuilder.group({});
        this.rootFormGroup.setControl('misc', this.formGroup);
        if (this.pairs) {
            this.pairs.forEach((p) => {
                this.formGroup.setControl(`k-${p.id}`, this.formBuilder.control(p.key));
                this.formGroup.setControl(`v-${p.id}`, this.formBuilder.control(p.value, [Validators.required]));
            });
            this.pairs.forEach((p) => {
                this.formGroup.controls[`k-${p.id}`].setValidators([Validators.required, uniqueKeyValidator(p, this.pairs, this.formGroup)]);
            });
        }
    }
    onAddPairClicked($event) {
        const c = this.counter--;
        const p = { id: c, key: '', value: '' };
        this.formGroup.setControl(`k-${p.id}`, this.formBuilder.control(p.key));
        this.formGroup.setControl(`v-${p.id}`, this.formBuilder.control(p.value, [Validators.required]));
        this.pairs.push({ id: c, key: '', value: '' });
        this.formGroup.controls[`k-${p.id}`].setValidators([Validators.required, uniqueKeyValidator(p, this.pairs, this.formGroup)]);
    }
    getModifiedPair1() {
        const newPairs = this.pairs.map((p) => {
            const newPair = Object.assign({}, p);
            newPair.key = this.formGroup.get(`k-${p.id}`).value;
            newPair.value = this.formGroup.get(`v-${p.id}`).value;
            return newPair;
        });
        return newPairs;
    }
    onDeleteClicked($event, pair) {
        this.formGroup.controls[`k-${pair.id}`].clearValidators();
        this.formGroup.controls[`v-${pair.id}`].clearValidators();
        this.formGroup.removeControl(`k-${pair.id}`);
        this.formGroup.removeControl(`v-${pair.id}`);
        this.pairs = this.pairs.filter((p) => p.id !== pair.id);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", FormGroup)
], SingleSelectComponent.prototype, "rootFormGroup", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], SingleSelectComponent.prototype, "pairs", void 0);
SingleSelectComponent = tslib_1.__decorate([
    Component({
        selector: 'app-single-select',
        templateUrl: './single-select.component.html',
        styleUrls: ['./single-select.component.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], SingleSelectComponent);
export { SingleSelectComponent };
//# sourceMappingURL=single-select.component.js.map