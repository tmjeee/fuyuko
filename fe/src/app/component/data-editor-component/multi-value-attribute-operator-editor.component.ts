import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Attribute} from "../../model/attribute.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {OperatorType} from "../../model/operator.model";
import {
    AreaValue,
    CURRENCY_FORMAT,
    DATE_FORMAT,
    CurrencyValue, DimensionValue, DoubleSelectValue, HeightValue,
    LengthValue, SelectValue,
    Value,
    VolumeValue,
    WidthValue
} from "../../model/item.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {operatorNeedsItemValue, operatorsForAttribute} from "../../utils/attribute-operators.util";
import {convertToString} from "../../shared-utils/ui-item-value-converters.util";
import * as numeral from "numeral";
import {MatSelectChange} from "@angular/material/select";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {createNewItemValue} from "../../shared-utils/ui-item-value-creator.utils";
import {
    setItemAreaValue,
    setItemCurrencyValue,
    setItemDateValue, setItemDimensionValue, setItemDoubleSelectValue, setItemHeightValue, setItemLengthValue,
    setItemNumberValue, setItemSelectValue,
    setItemStringValue,
    setItemTextValue, setItemVolumeValue, setItemWidthValue
} from "../../shared-utils/ui-item-value-setter.util";
import {ItemValueOperatorAndAttributeWithId} from "../rules-component/rule-editor.component";


@Component({
    selector: 'app-multi-value-attribute-operator-editor',
    templateUrl: './multi-value-attribute-operator-editor.component.html',
    styleUrls: ['./multi-value-attribute-operator-editor.component.scss']
})
export class MultiValueAttributeOperatorEditorComponent {

    @Input() attributes: Attribute[];
    @Input() itemValueOperatorAndAttributeWithId: ItemValueOperatorAndAttributeWithId;
    operators: OperatorType[];

    @Output() events: EventEmitter<ItemValueOperatorAndAttributeWithId>;

    DATE_FORMAT = DATE_FORMAT;

    attribute: Attribute;
    operator: OperatorType;
    itemValues: Value[];

    formGroup: FormGroup;
    formControlAttribute: FormControl;
    formControlOperator: FormControl;
    formArray: FormArray; // array of formGroup (with formControl, fromControl2, formControl3 and formControl4)


    constructor(private formBuilder: FormBuilder) {
        this.events = new EventEmitter();
        this.operators = [];
    }

    ngOnInit(): void {
        if (this.itemValueOperatorAndAttributeWithId) {
            if (this.itemValueOperatorAndAttributeWithId.attribute) {
                this.attribute = this.itemValueOperatorAndAttributeWithId.attribute;
            }
            if (this.itemValueOperatorAndAttributeWithId.operator) {
                this.operator = this.itemValueOperatorAndAttributeWithId.operator;
            }
            if (this.itemValueOperatorAndAttributeWithId.itemValue) {
                this.itemValues = this.itemValueOperatorAndAttributeWithId.itemValue;
            }
        }
        this.reload();
    }

    reload() {
        this.formGroup = this.formBuilder.group({});
        this.formControlAttribute = this.formBuilder.control('', [Validators.required]);
        this.formControlOperator = this.formBuilder.control('', [Validators.required]);
        this.formGroup.setControl('attribute', this.formControlAttribute);
        this.formGroup.setControl('operator', this.formControlOperator);
        this.formArray = this.formBuilder.array([]);

        if (this.attribute) {
            this.formControlAttribute.setValue(
                this.attributes.find((a: Attribute) => a.id === this.attribute.id));
            this.operators = operatorsForAttribute(this.attribute);

            if (this.operators && this.operator && (this.operators.find((o: OperatorType) => o === this.operator))) {
                this.formControlOperator = this.formBuilder.control(this.operator, [Validators.required]);
            }
            const hasItemValueForOperator = this.formControlOperator && operatorNeedsItemValue(this.formControlOperator.value);
            if (/*this.itemValue &&*/ hasItemValueForOperator) {
                for (const itemValue of this.itemValues) {
                    const fg: FormGroup = this.formBuilder.group({});
                    this.formArray.push(fg);
                    switch (this.attribute.type) {
                        case 'string':
                        case 'text':
                        case 'number':
                        case 'date': {
                            const v = this.itemValues ? convertToString(this.attribute, itemValue) : '';
                            const formControl: FormControl = this.formBuilder.control(v, [Validators.required]);
                            fg.addControl('formControl', formControl);
                            break;
                        }
                        case 'currency': {
                            let currencyValue = ``;
                            let currencyCountry = ``;
                            if (itemValue && itemValue.val) {
                                const itemValueType: CurrencyValue = itemValue.val as CurrencyValue;
                                currencyValue = `${numeral(itemValueType.value).format(CURRENCY_FORMAT)}`;
                                currencyCountry = `${itemValueType.country}`;
                            }
                            const formControl: FormControl = this.formBuilder.control(currencyValue, [Validators.required]);
                            const formControl2: FormControl = this.formBuilder.control(currencyCountry, [Validators.required]);
                            fg.addControl('formControl', formControl);
                            fg.addControl('formControl2', formControl2);
                            break;
                        }
                        case 'area':
                        case 'volume':
                        case 'width':
                        case 'length':
                        case 'height': {
                            let v = ``;
                            let u = ``;
                            if (itemValue && itemValue.val) {
                                const itemValueType: AreaValue | VolumeValue | WidthValue | LengthValue | HeightValue =
                                    itemValue.val as any;
                                v = String(itemValueType.value);
                                u = itemValueType.unit;
                            }
                            const formControl: FormControl = this.formBuilder.control(v, [Validators.required]);
                            const formControl2: FormControl = this.formBuilder.control(u, [Validators.required]);
                            fg.addControl('formControl', formControl);
                            fg.addControl('formControl2', formControl2);
                            break;
                        }
                        case 'dimension': {
                            let l = '';
                            let w = '';
                            let h = '';
                            let u = '';
                            if (itemValue && itemValue.val) {
                                const itemValueType: DimensionValue = itemValue.val as DimensionValue;
                                l = String(itemValueType.length);
                                w = String(itemValueType.width);
                                h = String(itemValueType.height);
                                u = itemValueType.unit;
                            }
                            const formControl: FormControl = this.formBuilder.control(l, [Validators.required]);
                            const formControl2: FormControl = this.formBuilder.control(w, [Validators.required]);
                            const formControl3: FormControl = this.formBuilder.control(h, [Validators.required]);
                            const formControl4: FormControl = this.formBuilder.control(u, [Validators.required]);
                            fg.addControl('formControl', formControl);
                            fg.addControl('formControl2', formControl2);
                            fg.addControl('formControl3', formControl3);
                            fg.addControl('formControl4', formControl4);
                            break;
                        }
                        case 'select': {
                            let k = '';
                            if (itemValue && itemValue.val) {
                                const itemValueType: SelectValue = itemValue.val as SelectValue;
                                k = itemValueType.key;
                            }
                            const formControl: FormControl = this.formBuilder.control(k, [Validators.required]);
                            fg.addControl('formControl', formControl);
                            break;
                        }
                        case 'doubleselect': {
                            let k1 = '';
                            let k2 = '';
                            if (itemValue && itemValue.val) {
                                const itemValueType: DoubleSelectValue = itemValue.val as DoubleSelectValue;
                                k1 = itemValueType.key1;
                                k2 = itemValueType.key2;
                            }
                            const formControl: FormControl = this.formBuilder.control(k1, [Validators.required]);
                            const formControl2: FormControl = this.formBuilder.control(k2, [Validators.required]);
                            fg.addControl('formControl', formControl);
                            fg.addControl('formControl2', formControl2);
                            break;
                        }
                    }
                }
            }
        }
    }

    onAttributeSelectionChange($event: MatSelectChange) {
        this.attribute = $event.value;
        this.operators = [];
        this.operator = null;
        this.itemValues = [];
        this.reload();
        this.emitEvent();
    }

    onOperatorSelectionChange($event: MatSelectChange) {
        this.operator = $event.value;
        this.itemValues = [];
        this.reload();
        this.emitEvent();
    }


    onDateChange($event: MatDatepickerInputEvent<any>) {
        this.onValueChange();
    }

    onValueChange() {
        for (let i = 0; i < this.itemValues.length; i++) {
            let itemValue: Value = this.itemValues[i];
            if (!itemValue) {
                itemValue = createNewItemValue(this.attribute);
                this.itemValues[i] = itemValue;
            }
            const fg: FormGroup = this.formArray.at(i) as FormGroup;
            if (fg && fg.controls.formControl) {
                switch (this.attribute.type) {
                    case 'string':
                        setItemStringValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'text':
                        setItemTextValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'number':
                        setItemNumberValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'date':
                        setItemDateValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'currency':
                        setItemCurrencyValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'area':
                        setItemAreaValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'volume':
                        setItemVolumeValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'width':
                        setItemWidthValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'length':
                        setItemLengthValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'height': {
                        setItemHeightValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    }
                    case 'dimension': {
                        setItemDimensionValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value,
                            fg.controls.formControl3.value, fg.controls.formControl4.value);
                        break;
                    }
                    case 'select': {
                        setItemSelectValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    }
                    case 'doubleselect': {
                        setItemDoubleSelectValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    }
                }
            }
        }
        this.emitEvent();
    }

    emitEvent() {
        const attribute: Attribute = this.formControlAttribute.value;
        const operator: OperatorType = this.formControlOperator.value;
        const itemValues: Value[] = [];
        for (let i = 0; i < this.itemValues.length; i++) {
            if (this.formArray) {
                const fg: FormGroup = this.formArray.at(i) as FormGroup;
                const itemValue: Value = createNewItemValue(this.attribute);
                itemValues.push(itemValue);
                switch (this.attribute.type) {
                    case 'string':
                        setItemStringValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'text':
                        setItemTextValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'number':
                        setItemNumberValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'date':
                        setItemDateValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    case 'currency':
                        setItemCurrencyValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'area':
                        setItemAreaValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'volume':
                        setItemVolumeValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'width':
                        setItemWidthValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'length':
                        setItemLengthValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    case 'height': {
                        setItemHeightValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    }
                    case 'dimension': {
                        setItemDimensionValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value,
                            fg.controls.formControl3.value, fg.controls.formControl4.value);
                        break;
                    }
                    case 'select': {
                        setItemSelectValue(this.attribute, itemValue, fg.controls.formControl.value);
                        break;
                    }
                    case 'doubleselect': {
                        setItemDoubleSelectValue(this.attribute, itemValue, fg.controls.formControl.value, fg.controls.formControl2.value);
                        break;
                    }
                }
            }
        }
        const event = {
            attribute,
            operator,
            itemValue: itemValues
        } as ItemValueOperatorAndAttributeWithId;

        this.events.emit(event);
    }

}