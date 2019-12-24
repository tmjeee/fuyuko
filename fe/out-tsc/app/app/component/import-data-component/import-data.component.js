import * as tslib_1 from "tslib";
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
let ImportDataComponent = class ImportDataComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.viewFormControl = formBuilder.control('', [Validators.required]);
        this.firstFormGroup = formBuilder.group({
            view: this.viewFormControl
        });
        this.uploadTypeFormControl = formBuilder.control('', [Validators.required]);
        this.fileUploadFormControl = formBuilder.control(undefined, [Validators.required]);
        this.secondFormGroup = formBuilder.group({
            uploadType: this.uploadTypeFormControl,
            fileUpload: this.fileUploadFormControl
        });
        this.thirdFormGroup = formBuilder.group({});
        this.disableThirdForm = true;
        this.fourthFormGroup = formBuilder.group({});
        this.jobSubmitted = false;
    }
    onUploadTypeSelectionChanged($event) {
        this.selectedUploadType = $event.value;
    }
    onUploadDataFileChange(files) {
        if (files && files.length) {
            this.fileUploadFormControl.setValue(files.item(0));
        }
        else {
            this.fileUploadFormControl.setValue(undefined);
        }
    }
    onFirstFormSubmit() {
    }
    onSecondFormSubmit() {
        const view = this.viewFormControl.value;
        const file = this.fileUploadFormControl.value;
        this.showPreview(view.id, this.selectedUploadType, file)
            .pipe(tap((dataImport) => {
            switch (dataImport.type) {
                case 'ATTRIBUTE':
                    this.attributeDataImport = dataImport;
                    this.itemDataImport = undefined;
                    this.priceDataImport = undefined;
                    break;
                case 'ITEM':
                    this.attributeDataImport = undefined;
                    this.itemDataImport = dataImport;
                    this.priceDataImport = undefined;
                    break;
                case 'PRICE':
                    this.attributeDataImport = undefined;
                    this.itemDataImport = undefined;
                    this.priceDataImport = dataImport;
                    break;
            }
            this.disableThirdForm = !!(dataImport
                && dataImport.messages && dataImport.messages.errors && dataImport.messages.errors.length);
        })).subscribe();
    }
    onThirdFormSubmit() {
        this.jobSubmitted = false;
        const view = this.viewFormControl.value;
        const body = {};
        switch (this.selectedUploadType) {
            case 'ATTRIBUTE':
                body.dataImportId = this.attributeDataImport.dataImportId;
                body.attributes = this.attributeDataImport.attributes;
                break;
            case 'PRICE':
                body.dataImportId = this.priceDataImport.dataImportId;
                body.pricingStructureItemsWithPrice = this.priceDataImport.items;
                break;
            case 'ITEM':
                body.dataImportId = this.itemDataImport.dataImportId;
                body.items = this.itemDataImport.items;
                break;
        }
        this.submitDataImport(view.id, this.selectedUploadType, body)
            .pipe(tap((j) => {
            this.job = j;
            this.jobSubmitted = true;
        })).subscribe();
    }
    onFourthFormSubmit(stepper) {
        if (this.fileUploadInputElement) {
            this.fileUploadInputElement.nativeElement.value = '';
        }
        stepper.reset();
    }
};
tslib_1.__decorate([
    ViewChild('fileUploadInputElement', { static: true }),
    tslib_1.__metadata("design:type", ElementRef)
], ImportDataComponent.prototype, "fileUploadInputElement", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ImportDataComponent.prototype, "views", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], ImportDataComponent.prototype, "showPreview", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], ImportDataComponent.prototype, "submitDataImport", void 0);
ImportDataComponent = tslib_1.__decorate([
    Component({
        selector: 'app-import-data',
        templateUrl: './import-data.component.html',
        styleUrls: ['./import-data.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], ImportDataComponent);
export { ImportDataComponent };
//# sourceMappingURL=import-data.component.js.map