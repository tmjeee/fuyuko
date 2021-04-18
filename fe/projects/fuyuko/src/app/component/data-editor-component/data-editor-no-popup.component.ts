import moment from 'moment';
import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {ItemValueAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {
    AreaValue,
    CURRENCY_FORMAT,
    CurrencyValue, DATE_FORMAT, DimensionValue, DoubleSelectValue, HEIGHT_FORMAT, HeightValue,
    LengthValue, SelectValue,
    Value,
    VolumeValue, WeightValue,
    WidthValue
} from '@fuyuko-common/model/item.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
    AREA_UNITS,
    AreaUnits, COUNTRY_CURRENCY_UNITS,
    CountryCurrencyUnits, DIMENSION_UNITS,
    DimensionUnits, HEIGHT_UNITS,
    HeightUnits, LENGTH_UNITS, LengthUnits, VOLUME_UNITS,
    VolumeUnits, WEIGHT_UNITS, WeightUnits, WIDTH_UNITS,
    WidthUnits
} from '@fuyuko-common/model/unit.model';
import {convertToString} from '@fuyuko-common/shared-utils/ui-item-value-converters.util';
import {
    setItemAreaValue,
    setItemCurrencyValue,
    setItemDateValue,
    setItemDimensionValue, setItemDoubleSelectValue,
    setItemHeightValue,
    setItemLengthValue,
    setItemNumberValue, setItemSelectValue,
    setItemStringValue,
    setItemTextValue,
    setItemVolumeValue, setItemWeightValue,
    setItemWidthValue
} from '@fuyuko-common/shared-utils/ui-item-value-setter.util';
import {createNewItemValue} from '@fuyuko-common/shared-utils/ui-item-value-creator.utils';
import * as numeral from 'numeral';

@Component({
    selector: 'app-data-editor-no-popup',
    templateUrl: './data-editor-no-popup.component.html',
    styleUrls: ['./data-editor-no-popup.component.scss'],
})
export class DataEditorNoPopupComponent implements OnInit {

    @Input() attributes: Attribute[];
    @Input() itemValueAndAttribute: ItemValueAndAttribute;
    @Output() events: EventEmitter<ItemValueAndAttribute>;

    attribute: Attribute;
    itemValue: Value;

    currencyUnits: CountryCurrencyUnits[];
    areaUnits: AreaUnits[];
    volumeUnits: VolumeUnits[];
    dimensionUnits: DimensionUnits[];
    widthUnits: WidthUnits[];
    heightUnits: HeightUnits[];
    lengthUnits: LengthUnits[];
    weightUnits: WeightUnits[];


    formGroup: FormGroup;
    formControlAttribute: FormControl;
    formControl: FormControl;
    formControl2: FormControl;
    formControl3: FormControl;
    formControl4: FormControl;

    constructor(private formBuilder: FormBuilder) {
        this.events = new EventEmitter();
        this.currencyUnits = [...COUNTRY_CURRENCY_UNITS];
        this.areaUnits = [...AREA_UNITS];
        this.volumeUnits = [...VOLUME_UNITS];
        this.dimensionUnits = [...DIMENSION_UNITS];
        this.widthUnits = [...WIDTH_UNITS];
        this.heightUnits = [...HEIGHT_UNITS];
        this.lengthUnits = [...LENGTH_UNITS];
        this.weightUnits = [...WEIGHT_UNITS];
    }

    ngOnInit() {
        if (this.attributes && this.attributes.length) {
            this.attribute = this.attributes.find((att: Attribute) => att.id === this.itemValueAndAttribute.attribute.id);
            if (this.itemValueAndAttribute) {
                this.itemValue = this.itemValueAndAttribute.itemValue;
            }
            this.reload();
        }
    }

    attributeSelectionChanged($event: MatSelectChange) {
        const attribute: Attribute = $event.value;
        if (attribute) {
            this.attribute = attribute;
            this.itemValue = createNewItemValue(attribute);
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
               case 'number': {
                   this.formControl = this.formBuilder.control(convertToString(this.attribute, this.itemValue), [Validators.required]);
                   this.formGroup.addControl('formControl', this.formControl);
                   break;
                   break;
               }
               case 'date': {
                   const dateInString: string = convertToString(this.attribute, this.itemValue);
                   let m: moment.Moment = null;
                   if (dateInString) {
                       m = moment(dateInString, this.attribute.format ? this.attribute.format : DATE_FORMAT);
                   }
                   this.formControl = this.formBuilder.control(m, [Validators.required]);
                   this.formGroup.addControl('formControl', this.formControl);
                   break;
               }
               case 'currency': {
                   let currencyValue = ``;
                   let currencyCountry = ``;
                   if (this.itemValue && this.itemValue.val) {
                       const itemValueType: CurrencyValue = this.itemValue.val as CurrencyValue;
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
               case 'height':
               case 'weight': {
                   let v = ``;
                   let u = ``;
                   if (this.itemValue && this.itemValue.val) {
                       const itemValueType: AreaValue | VolumeValue | WidthValue | LengthValue | HeightValue | WeightValue =
                           this.itemValue.val as any;
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
                       const itemValueType: DimensionValue = this.itemValue.val as DimensionValue;
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
                       const itemValueType: SelectValue = this.itemValue.val as SelectValue;
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
                       const itemValueType: DoubleSelectValue = this.itemValue.val as DoubleSelectValue;
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

    onDateChanged($event: MatDatepickerInputEvent<any>) {
        this.emitEvent();
    }

    onUnitSelectionChanged($event: MatSelectChange) {
        this.emitEvent();
    }

    onSingleSelectChange($event: MatSelectChange) {
        this.emitEvent();
    }

    onDoubleSelectChange($event: MatSelectChange) {
        this.emitEvent();
    }

    private emitEvent() {
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
                    case 'weight':
                        setItemWeightValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                        break;
                    case 'dimension':
                        setItemDimensionValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value,
                            this.formControl3.value, this.formControl4.value);
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
            } as ItemValueAndAttribute);
        }
    }
}

