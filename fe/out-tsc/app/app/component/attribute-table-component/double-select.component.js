import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export const uniqueP1KeyValidator = (currentPair, pairs, formGroup) => (c) => {
    const count = pairs.filter((p) => {
        const v = (currentPair.id !== p.id && formGroup.get(`p1-k-${p.id}`) && formGroup.get(`p1-k-${p.id}`).value === c.value);
        return v;
    }).length;
    if (count > 0) {
        return { uniqueP1Key: true };
    }
    return null;
};
export const uniqueP2Key1Validator = (formGroup) => (c) => {
    let valid = false;
    Object.keys(formGroup.controls)
        .filter((k) => {
        return k.startsWith('p1-k-');
    })
        .forEach((k) => {
        if (formGroup.controls[k].value === c.value) {
            valid = true;
        }
    });
    if (!valid) {
        return { uniqueP2Key1: true };
    }
    return null;
};
export const uniqueP2Key2Validator = (currentPair, pairs, formGroup) => (c) => {
    const count = pairs.filter((p) => {
        const v = (currentPair.id !== p.id && formGroup.get(`p2-k2-${p.id}`) && formGroup.get(`p2-k2-${p.id}`).value === c.value);
        return v;
    }).length;
    if (count > 0) {
        return { uniqueP2Key2: true };
    }
    return null;
};
let DoubleSelectComponent = class DoubleSelectComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.counter = -1;
    }
    ngOnInit() {
        this.pairs1 = this.pairs1 ? [...this.pairs1] : [];
        this.pairs2 = this.pairs2 ? [...this.pairs2] : [];
        this.formGroup = this.formBuilder.group({});
        this.rootFormGroup.setControl('misc', this.formGroup);
        if (this.pairs1) {
            this.pairs1.forEach((p) => {
                this.formGroup.setControl(`p1-k-${p.id}`, this.formBuilder.control(p.key));
                this.formGroup.setControl(`p1-v-${p.id}`, this.formBuilder.control(p.value, [Validators.required]));
            });
            this.pairs1.forEach((p) => {
                this.formGroup.controls[`p1-k-${p.id}`].setValidators([
                    Validators.required,
                    uniqueP1KeyValidator(p, this.pairs1, this.formGroup)
                ]);
            });
        }
        if (this.pairs2) {
            this.pairs2.forEach((p) => {
                this.formGroup.setControl(`p2-k1-${p.id}`, this.formBuilder.control(p.key1));
                this.formGroup.setControl(`p2-k2-${p.id}`, this.formBuilder.control(p.key2));
                this.formGroup.setControl(`p2-v-${p.id}`, this.formBuilder.control(p.value, [Validators.required]));
            });
            this.pairs2.forEach((p) => {
                this.formGroup.controls[`p2-k1-${p.id}`].setValidators([
                    Validators.required,
                    uniqueP2Key1Validator(this.formGroup)
                ]);
                this.formGroup.controls[`p2-k2-${p.id}`].setValidators([
                    Validators.required,
                    uniqueP2Key2Validator(p, this.pairs2, this.formGroup)
                ]);
            });
        }
        else {
            this.pairs2 = [];
        }
    }
    onAddPair1Clicked($event) {
        const c = this.counter--;
        const p = { id: c, key: '', value: '' };
        this.pairs1.push(p);
        this.formGroup.setControl(`p1-k-${p.id}`, this.formBuilder.control(p.key));
        this.formGroup.setControl(`p1-v-${p.id}`, this.formBuilder.control(p.value, [Validators.required]));
        this.formGroup.controls[`p1-k-${p.id}`].setValidators([
            Validators.required,
            uniqueP1KeyValidator(p, this.pairs1, this.formGroup)
        ]);
    }
    onAddPair2Clicked($event) {
        const c = this.counter--;
        const p = { id: c, key1: '', key2: '', value: '' };
        this.pairs2.push(p);
        this.formGroup.setControl(`p2-k1-${p.id}`, this.formBuilder.control(p.key1));
        this.formGroup.setControl(`p2-k2-${p.id}`, this.formBuilder.control(p.key2));
        this.formGroup.setControl(`p2-v-${p.id}`, this.formBuilder.control(p.value, [Validators.required]));
        this.formGroup.controls[`p2-k1-${p.id}`].setValidators([
            Validators.required,
            uniqueP2Key1Validator(this.formGroup)
        ]);
        this.formGroup.controls[`p2-k2-${p.id}`].setValidators([
            Validators.required,
            uniqueP2Key2Validator(p, this.pairs2, this.formGroup)
        ]);
    }
    onDeletePair1Clicked($event, pair1) {
        this.formGroup.controls[`p1-k-${pair1.id}`].clearValidators();
        this.formGroup.controls[`p1-v-${pair1.id}`].clearValidators();
        this.formGroup.removeControl(`p1-k-${pair1.id}`);
        this.formGroup.removeControl(`p1-v-${pair1.id}`);
        this.pairs1 = this.pairs1.filter((p) => p.id !== pair1.id);
    }
    onDeletePair2Clicked($event, pair2) {
        this.formGroup.controls[`p2-k1-${pair2.id}`].clearValidators();
        this.formGroup.controls[`p2-k2-${pair2.id}`].clearValidators();
        this.formGroup.controls[`p2-v-${pair2.id}`].clearValidators();
        this.formGroup.removeControl(`p2-k1-${pair2.id}`);
        this.formGroup.removeControl(`p2-k2-${pair2.id}`);
        this.formGroup.removeControl(`p2-v-${pair2.id}`);
        this.pairs2 = this.pairs2.filter((p) => p.id !== pair2.id);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", FormGroup)
], DoubleSelectComponent.prototype, "rootFormGroup", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], DoubleSelectComponent.prototype, "pairs1", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], DoubleSelectComponent.prototype, "pairs2", void 0);
DoubleSelectComponent = tslib_1.__decorate([
    Component({
        selector: 'app-double-select',
        templateUrl: './double-select.component.html',
        styleUrls: ['./double-select.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], DoubleSelectComponent);
export { DoubleSelectComponent };
//# sourceMappingURL=double-select.component.js.map