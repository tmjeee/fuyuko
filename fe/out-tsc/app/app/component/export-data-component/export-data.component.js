import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { convertToString } from '../../shared-utils/ui-item-value-converters.util';
let ExportDataComponent = class ExportDataComponent {
    constructor(formBuilder, changeDetectorRef) {
        this.formBuilder = formBuilder;
        this.changeDetectorRef = changeDetectorRef;
        this.itemFilterCounter = 1;
        this.viewFormControl = formBuilder.control(undefined, [Validators.required]);
        this.firstFormGroup = formBuilder.group({
            view: this.viewFormControl
        });
        this.secondFormReady = false;
        this.currentAttributeSelectionOption = 'all';
        this.exportTypeFormControl = formBuilder.control('', [Validators.required]);
        this.attributeSelectionOptionFormControl = formBuilder.control('all', [Validators.required]);
        this.secondFormGroup = formBuilder.group({
            exportType: this.exportTypeFormControl,
            attributeSelectionOption: this.attributeSelectionOptionFormControl
        });
        this.secondFormGroup.setValidators((c) => {
            const attributesFormGroup = c.get('attributes');
            if (attributesFormGroup) {
                if (this.attributeSelectionOptionFormControl.value === 'selection') {
                    const valid = Object.values(attributesFormGroup.controls).reduce((r, ctl) => {
                        console.log('ctl', ctl.value);
                        return (r || ctl.value);
                    }, false);
                    if (!valid) {
                        return { selectAtLeastOneAttribute: true };
                    }
                }
            }
            return null;
        });
        this.itemValueOperatorAndAttributeList = [];
        this.thirdFormGroup = formBuilder.group({});
        this.fourthFormReady = false;
        this.dataExport = null;
        this.fourthFormGroup = formBuilder.group({});
        this.jobSubmitted = false;
        this.job = null;
        this.fifthFormGroup = formBuilder.group({});
    }
    ngOnInit() {
    }
    onAttributeSelectionOptionChange($event) {
        this.currentAttributeSelectionOption = $event.value;
        this.secondFormGroup.updateValueAndValidity();
    }
    onFirstFormSubmit() {
        this.secondFormReady = false;
        const viewId = this.viewFormControl.value;
        this.viewAttributesFn(viewId)
            .pipe(tap((a) => {
            this.allAttributes = a;
            const attributesFormGroup = this.formBuilder.group({});
            this.secondFormGroup.removeControl('attributes');
            this.secondFormGroup.setControl('attributes', attributesFormGroup);
            this.allAttributes.forEach((ia) => {
                const control = this.formBuilder.control(false);
                control.internalData = ia;
                attributesFormGroup.setControl('' + ia.id, control);
            });
            this.secondFormReady = true;
        })).subscribe();
    }
    onSecondFormSubmit() {
    }
    onThirdFormSubmit() {
        this.fourthFormReady = false;
        // export type
        const exportType = this.exportTypeFormControl.value;
        // figure out view id (from step 1)
        const viewId = this.viewFormControl.value;
        // figure out attributes (from step 2)
        let att = null;
        if (this.currentAttributeSelectionOption === 'selection') {
            att = [];
            const fg = this.secondFormGroup.get('attributes');
            for (const [, c] of Object.entries(fg.controls)) {
                const a = c.internalData;
                att.push(a);
            }
        }
        // figure out item filters (from step 3)
        const f = this.itemValueOperatorAndAttributeList;
        this.previewExportFn(exportType, viewId, att, f).pipe(tap((dataExport) => {
            this.dataExport = dataExport;
            this.fourthFormReady = true;
        })).subscribe();
    }
    onFourthFormSubmit() {
        // export type
        const exportType = this.exportTypeFormControl.value;
        // figure out view id (from step 1)
        const viewId = this.viewFormControl.value;
        // figure out attributes (from step 2)
        let att = null;
        if (this.currentAttributeSelectionOption === 'selection') {
            att = [];
            const fg = this.secondFormGroup.get('attributes');
            for (const [, c] of Object.entries(fg.controls)) {
                const a = c.internalData;
                att.push(a);
            }
        }
        // figure out item filters (from step 3)
        const f = this.itemValueOperatorAndAttributeList;
        this.jobSubmitted = false;
        this.submitExportJobFn(exportType, viewId, att, this.dataExport, f).pipe(tap((j) => {
            this.job = j;
            this.jobSubmitted = true;
        })).subscribe();
    }
    onFifthFormSubmit(stepper) {
        stepper.reset();
    }
    onAttributeOperatorEvent($event, orig) {
        const id = orig.id;
        const g = this.thirdFormGroup.get('' + id);
        g.get('attribute').setValue($event.attribute);
        g.get('operator').setValue($event.operator);
        g.get('itemValue').setValue($event.attribute ? convertToString($event.attribute, $event.itemValue) : undefined);
        this.thirdFormGroup.updateValueAndValidity();
    }
    onAddItemFilter($event) {
        const id = this.itemFilterCounter++;
        const i = {
            id,
            attribute: null,
            operator: null,
            itemValue: null
        };
        this.itemValueOperatorAndAttributeList.push(i);
        const g = this.formBuilder.group({
            attribute: this.formBuilder.control(null, [Validators.required]),
            operator: this.formBuilder.control(null, [Validators.required]),
            itemValue: this.formBuilder.control(null, [Validators.required])
        });
        this.thirdFormGroup.setControl('' + i.id, g);
    }
    onDeleteItemFilter($event, itemValueOperatorAndAttribute) {
        this.itemValueOperatorAndAttributeList =
            this.itemValueOperatorAndAttributeList.filter((i) => i !== itemValueOperatorAndAttribute);
        this.thirdFormGroup.removeControl('' + itemValueOperatorAndAttribute.id);
    }
    onAttributeCheckboxChange($event) {
        this.secondFormGroup.updateValueAndValidity();
        this.changeDetectorRef.detectChanges();
    }
    onExportTypeSelectionChanged($event) {
        this.selectedExportType = $event.value;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ExportDataComponent.prototype, "views", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], ExportDataComponent.prototype, "viewAttributesFn", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], ExportDataComponent.prototype, "previewExportFn", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], ExportDataComponent.prototype, "submitExportJobFn", void 0);
ExportDataComponent = tslib_1.__decorate([
    Component({
        selector: 'app-export-data',
        templateUrl: './export-data.component.html',
        styleUrls: ['./export-data.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder,
        ChangeDetectorRef])
], ExportDataComponent);
export { ExportDataComponent };
//# sourceMappingURL=export-data.component.js.map