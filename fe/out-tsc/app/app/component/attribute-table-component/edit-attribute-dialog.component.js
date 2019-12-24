import * as tslib_1 from "tslib";
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ATTRIBUTE_TYPES } from '../../model/attribute.model';
import { FormBuilder, Validators } from '@angular/forms';
import { dateFormatValidator, numberFormatValidator } from '../../service/custom-validators';
import { SingleSelectComponent } from './single-select.component';
let EditAttributeDialogComponent = class EditAttributeDialogComponent {
    constructor(dialogRef, formBuilder, attribute) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.attribute = attribute;
        this.attributeTypes = ATTRIBUTE_TYPES;
        this.currentSelectedAttributeType = attribute.type;
        this.formControlAttributeName = this.formBuilder.control(attribute.name, [Validators.required]);
        this.formControlAttributeDescription = this.formBuilder.control(attribute.description, [Validators.required]);
        this.formControlAttributeType = this.formBuilder.control(attribute.type, [Validators.required]);
        this.formGroupCommon = this.formBuilder.group({
            name: this.formControlAttributeName,
            description: this.formControlAttributeDescription,
            type: this.formControlAttributeType
        });
        this.formControlNumberAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupNumberAttribute = this.formBuilder.group({
            format: this.formControlNumberAttributeFormat,
        });
        if (attribute.type === 'number') {
            this.formControlNumberAttributeFormat.setValue(attribute.format);
        }
        this.formControlDateAttributeFormat = this.formBuilder.control('', [dateFormatValidator]);
        this.formGroupDateAttribute = this.formBuilder.group({
            format: this.formControlDateAttributeFormat
        });
        if (attribute.type === 'date') {
            this.formControlDateAttributeFormat.setValue(attribute.format);
        }
        this.formControlCurrencyAttributeCountry = this.formBuilder.control('');
        this.formGroupCurrencyAttribute = this.formBuilder.group({
            country: this.formControlCurrencyAttributeCountry
        });
        if (attribute.type === 'currency') {
            this.formControlCurrencyAttributeCountry.setValue(attribute.showCurrencyCountry);
        }
        this.formControlDimensionAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupDimensionAttribute = this.formBuilder.group({
            format: this.formControlDimensionAttributeFormat,
        });
        if (attribute.type === 'dimension') {
            this.formControlDimensionAttributeFormat.setValue(attribute.format);
        }
        this.formControlVolumeAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupVolumeAttribute = this.formBuilder.group({
            format: this.formControlVolumeAttributeFormat,
        });
        if (attribute.type === 'volume') {
            this.formControlVolumeAttributeFormat.setValue(attribute.format);
        }
        this.formControlAreaAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupAreaAttribute = this.formBuilder.group({
            format: this.formControlAreaAttributeFormat,
        });
        if (attribute.type === 'area') {
            this.formControlAreaAttributeFormat.setValue(attribute.format);
        }
        this.formControlWidthAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupWidthAttribute = this.formBuilder.group({
            format: this.formControlWidthAttributeFormat,
        });
        if (attribute.type === 'width') {
            this.formControlWidthAttributeFormat.setValue(attribute.format);
        }
        this.formControlHeightAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupHeightAttribute = this.formBuilder.group({
            format: this.formControlHeightAttributeFormat,
        });
        if (attribute.type === 'height') {
            this.formControlHeightAttributeFormat.setValue(attribute.format);
        }
        this.formControlLengthAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupLengthAttribtue = this.formBuilder.group({
            format: this.formControlLengthAttributeFormat
        });
        if (attribute.type === 'length') {
            this.formControlLengthAttributeFormat.setValue(attribute.format);
        }
    }
    onAttributeTypeChange($event) {
        const attributeType = $event.value;
        this.currentSelectedAttributeType = attributeType;
        this.formGroupCommon.removeControl('misc');
        switch (attributeType) {
            case 'number':
                this.formGroupCommon.setControl('misc', this.formGroupNumberAttribute);
                break;
            case 'date':
                this.formGroupCommon.setControl('misc', this.formGroupDateAttribute);
                break;
            case 'currency':
                this.formGroupCommon.setControl('misc', this.formGroupCurrencyAttribute);
                break;
            case 'dimension':
                this.formGroupCommon.setControl('misc', this.formGroupDimensionAttribute);
                break;
            case 'volumne':
                this.formGroupCommon.setControl('misc', this.formGroupVolumeAttribute);
                break;
            case 'area':
                this.formGroupCommon.setControl('misc', this.formGroupAreaAttribute);
                break;
            case 'width':
                this.formGroupCommon.setControl('misc', this.formGroupWidthAttribute);
                break;
            case 'height':
                this.formGroupCommon.setControl('misc', this.formGroupHeightAttribute);
                break;
            case 'length':
                this.formGroupCommon.setControl('misc', this.formGroupLengthAttribtue);
                break;
            case 'select':
                // done in single-select-component.ts upon initialization
                break;
            case 'doubleselect':
                // done in double-select-component.ts upon initialization
                break;
        }
    }
    onSubmit() {
        const att = Object.assign({}, this.attribute);
        att.name = this.formControlAttributeName.value;
        att.description = this.formControlAttributeDescription.value;
        att.type = this.formControlAttributeType.value;
        switch (att.type) {
            case 'number':
                att.format = this.formControlNumberAttributeFormat.value;
                break;
            case 'date':
                att.format = this.formControlDateAttributeFormat.value;
                break;
            case 'currency':
                att.showCurrencyCountry = this.formControlCurrencyAttributeCountry.value;
                break;
            case 'dimension':
                att.format = this.formControlDimensionAttributeFormat.value;
                break;
            case 'volume':
                att.format = this.formControlVolumeAttributeFormat.value;
                break;
            case 'area':
                att.format = this.formControlAreaAttributeFormat.value;
                break;
            case 'width':
                att.format = this.formControlWidthAttributeFormat.value;
                break;
            case 'height':
                att.format = this.formControlHeightAttributeFormat.value;
                break;
            case 'length':
                att.format = this.formControlLengthAttributeFormat.value;
                break;
            case 'select':
                att.pair1 = this.singleSelectComponent.getModifiedPair1();
                break;
            case 'doubleselect':
                break;
        }
        this.dialogRef.close(att);
    }
    onCancelClicked($event) {
        this.dialogRef.close(undefined);
    }
    ngAfterViewInit() {
    }
};
tslib_1.__decorate([
    ViewChild('singleSelectComponent', { static: false }),
    tslib_1.__metadata("design:type", SingleSelectComponent)
], EditAttributeDialogComponent.prototype, "singleSelectComponent", void 0);
EditAttributeDialogComponent = tslib_1.__decorate([
    Component({
        templateUrl: './edit-attribute-dialog.component.html',
        styleUrls: ['./edit-attribute-dialog.component.scss']
    }),
    tslib_1.__param(2, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef,
        FormBuilder, Object])
], EditAttributeDialogComponent);
export { EditAttributeDialogComponent };
//# sourceMappingURL=edit-attribute-dialog.component.js.map