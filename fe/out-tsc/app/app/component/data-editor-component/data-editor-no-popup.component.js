import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CURRENCY_FORMAT } from '../../model/item.model';
import { FormBuilder, Validators } from '@angular/forms';
import { convertToString } from '../../shared-utils/ui-item-value-converters.util';
import { setItemAreaValue, setItemCurrencyValue, setItemDateValue, setItemDimensionValue, setItemDoubleSelectValue, setItemHeightValue, setItemLengthValue, setItemNumberValue, setItemSelectValue, setItemStringValue, setItemTextValue, setItemVolumeValue, setItemWidthValue } from '../../shared-utils/ui-item-value-setter.util';
let DataEditorNoPopupComponent = class DataEditorNoPopupComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.events = new EventEmitter();
    }
    ngOnInit() {
        if (this.attributes && this.attributes.length) {
            this.attribute = this.attributes.find((att) => att.id === this.itemValueAndAttribute.attribute.id);
            if (this.itemValueAndAttribute) {
                this.itemValue = this.itemValueAndAttribute.itemValue;
            }
            this.reload();
        }
    }
    attributeSelectionChanged($event) {
        const attribute = $event.value;
        if (attribute) {
            this.attribute = attribute;
            this.itemValue = null;
            this.reload();
        }
    }
    reload() {
        this.formGroup = this.formBuilder.group({});
        if (this.attribute) {
            this.formControlAttribute = this.formBuilder.control(this.attribute, [Validators.required]);
            this.formGroup.addControl('formControlAttribute', this.formControlAttribute);
            switch (this.attribute.type) {
                case 'string':
                case 'text':
                case 'number':
                case 'date': {
                    this.formControl = this.formBuilder.control(convertToString(this.attribute, this.itemValue), [Validators.required]);
                    this.formGroup.addControl('formControl', this.formControl);
                    break;
                }
                case 'currency': {
                    let currencyValue = ``;
                    let currencyCountry = ``;
                    if (this.itemValue && this.itemValue.val) {
                        const itemValueType = this.itemValue.val;
                        currencyValue = `${numeral(itemValueType.value).format(CURRENCY_FORMAT)}`;
                        currencyCountry = `${itemValueType.country}`;
                    }
                    this.formControl = this.formBuilder.control(currencyValue, [Validators.required]);
                    this.formControl2 = this.formBuilder.control(currencyCountry, [Validators.required]);
                    this.formGroup.addControl('formControl', this.formControl);
                    this.formGroup.addControl('formControl2', this.formControl2);
                    break;
                }
                case 'area':
                case 'volume':
                case 'width':
                case 'length':
                case 'height': {
                    let v = ``;
                    let u = ``;
                    if (this.itemValue && this.itemValue.val) {
                        const itemValueType = this.itemValue.val;
                        v = String(itemValueType.value);
                        u = itemValueType.unit;
                    }
                    this.formControl = this.formBuilder.control(v, [Validators.required]);
                    this.formControl2 = this.formBuilder.control(u, [Validators.required]);
                    this.formGroup.addControl('formControl', this.formControl);
                    this.formGroup.addControl('formControl2', this.formControl2);
                    break;
                }
                case 'dimension': {
                    let l = '';
                    let w = '';
                    let h = '';
                    let u = '';
                    if (this.itemValue && this.itemValue.val) {
                        const itemValueType = this.itemValue.val;
                        l = String(itemValueType.length);
                        w = String(itemValueType.width);
                        h = String(itemValueType.height);
                        u = itemValueType.unit;
                    }
                    this.formControl = this.formBuilder.control(l, [Validators.required]);
                    this.formControl2 = this.formBuilder.control(w, [Validators.required]);
                    this.formControl3 = this.formBuilder.control(h, [Validators.required]);
                    this.formControl4 = this.formBuilder.control(u, [Validators.required]);
                    this.formGroup.addControl('formControl', this.formControl);
                    this.formGroup.addControl('formControl2', this.formControl2);
                    this.formGroup.addControl('formControl3', this.formControl3);
                    this.formGroup.addControl('formControl4', this.formControl4);
                    break;
                }
                case 'select': {
                    let k = '';
                    if (this.itemValue && this.itemValue.val) {
                        const itemValueType = this.itemValue.val;
                        k = itemValueType.key;
                    }
                    this.formControl = this.formBuilder.control(k, [Validators.required]);
                    this.formGroup.addControl('formControl', this.formControl);
                    break;
                }
                case 'doubleselect': {
                    let k1 = '';
                    let k2 = '';
                    if (this.itemValue && this.itemValue.val) {
                        const itemValueType = this.itemValue.val;
                        k1 = itemValueType.key1;
                        k2 = itemValueType.key2;
                    }
                    this.formControl = this.formBuilder.control(k1, [Validators.required]);
                    this.formControl2 = this.formBuilder.control(k2, [Validators.required]);
                    this.formGroup.addControl('formControl', this.formControl);
                    this.formGroup.addControl('formControl2', this.formControl2);
                    break;
                }
            }
        }
    }
    valueChanged() {
        this.emitEvent();
    }
    onDateChanged($event) {
        this.emitEvent();
    }
    onUnitSelectionChanged($event) {
        this.emitEvent();
    }
    onSingleSelectChange($event) {
        this.emitEvent();
    }
    onDoubleSelectChange($event) {
        this.emitEvent();
    }
    emitEvent() {
        if (this.formGroup /*&& this.formGroup.valid*/) {
            if (this.attribute) {
                switch (this.attribute.type) {
                    case 'string':
                        setItemStringValue(this.attribute, this.itemValue, this.formControl.value);
                        break;
                    case 'text':
                        setItemTextValue(this.attribute, this.itemValue, this.formControl.value);
                        break;
                    case 'number':
                        setItemNumberValue(this.attribute, this.itemValue, this.formControl.value);
                        break;
                    case 'date':
                        setItemDateValue(this.attribute, this.itemValue, this.formControl.value);
                        break;
                    case 'currency':
                        setItemCurrencyValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                    case 'area':
                        setItemAreaValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                    case 'volume':
                        setItemVolumeValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                    case 'width':
                        setItemWidthValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                    case 'length':
                        setItemLengthValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                    case 'height':
                        setItemHeightValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                    case 'dimension':
                        setItemDimensionValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value, this.formControl3.value, this.formControl4.value);
                        break;
                    case 'select':
                        setItemSelectValue(this.attribute, this.itemValue, this.formControl.value);
                        break;
                    case 'doubleselect':
                        setItemDoubleSelectValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                }
            }
            this.events.emit({
                attribute: this.attribute,
                itemValue: this.itemValue
            });
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], DataEditorNoPopupComponent.prototype, "attributes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DataEditorNoPopupComponent.prototype, "itemValueAndAttribute", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DataEditorNoPopupComponent.prototype, "events", void 0);
DataEditorNoPopupComponent = tslib_1.__decorate([
    Component({
        selector: 'app-data-editor-no-popup',
        templateUrl: './data-editor-no-popup.component.html',
        styleUrls: ['./data-editor-no-popup.component.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], DataEditorNoPopupComponent);
export { DataEditorNoPopupComponent };
//# sourceMappingURL=data-editor-no-popup.component.js.map