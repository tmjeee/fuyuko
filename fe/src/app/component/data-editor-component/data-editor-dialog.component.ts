import {Component, Inject} from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  AREA_UNITS,
  COUNTRY_CURRENCY_UNITS,
  DIMENSION_UNITS,
  HEIGHT_UNITS,
  LENGTH_UNITS,
  VOLUME_UNITS,
  WIDTH_UNITS
} from '../../model/unit.model';
import {Attribute, Pair2} from '../../model/attribute.model';
import {
  AreaValue,
  CurrencyValue,
  DateValue, DimensionValue, DoubleSelectValue, HeightValue, TableItem, LengthValue,
  NumberValue, SelectValue,
  StringValue,
  TextValue,
  Value,
  VolumeValue, WidthValue, ItemValTypes, DATE_FORMAT
} from '../../model/item.model';
import {ItemValueAndAttribute, TableItemAndAttribute} from '../../model/item-attribute.model';
import {
  setItemAreaValue,
  setItemCurrencyValue,
  setItemDateValue, setItemDimensionValue, setItemDoubleSelectValue, setItemHeightValue, setItemLengthValue,
  setItemNumberValue, setItemSelectValue,
  setItemStringValue,
  setItemTextValue,
  setItemVolumeValue, setItemWidthValue
} from '../../shared-utils/ui-item-value-setter.util';
import {Pair2Map, doubleSelectToObjectMap} from '../../utils/doubleselect-helper.util';
import * as moment from 'moment';



@Component({
  templateUrl: './data-editor-dialog.component.html',
  styleUrls: ['./data-editor-dialog.component.scss']
})
export class DataEditorDialogComponent {

  formGroupStringAttribute: FormGroup;
  formControlStringAttributeValue: FormControl;

  formGroupTextAttribute: FormGroup;
  formControlTextAttributeValue: FormControl;

  formGroupNumberAttribute: FormGroup;
  formControlNumberAttributeValue: FormControl;

  formGroupDateAttribute: FormGroup;
  formControlDateAttributeValue: FormControl;

  formGroupCurrencyAttribute: FormGroup;
  formControlCurrencyAttributeValue: FormControl;
  formControlCurrencyAttributeCountry: FormControl;

  formGroupAreaAttribute: FormGroup;
  formControlAreaAttributeValue: FormControl;
  formControlAreaAttributeUnit: FormControl;

  formGroupVolumeAttribute: FormGroup;
  formControlVolumeAttributeValue: FormControl;
  formControlVolumeAttributeUnit: FormControl;

  formGroupDimensionAttribute: FormGroup;
  formControlDimensionAttributeWidthValue: FormControl;
  formControlDimensionAttributeHeightValue: FormControl;
  formControlDimensionAttributeLengthValue: FormControl;
  formControlDimensionAttributeUnit: FormControl;

  formGroupWidthAttribtue: FormGroup;
  formControlWidthAttributeValue: FormControl;
  formControlWidthAttributeUnit: FormControl;

  formGroupHeightAttribute: FormGroup;
  formControlHeightAttributeValue: FormControl;
  formControlHeightAttributeUnit: FormControl;

  formGroupLengthAttribute: FormGroup;
  formControlLengthAttributeValue: FormControl;
  formControlLengthAttribtueUnit: FormControl;

  formGroupSelectAttribute: FormGroup;
  formControlSelectAttributeKey: FormControl;

  formGroupDoubleSelectAttribute: FormGroup;
  formControlDoubleSelectKey1: FormControl;
  formControlDoubleSelectKey2: FormControl;

  readonly currencyUnits: string[] = COUNTRY_CURRENCY_UNITS;
  readonly areaUnits: string[] = AREA_UNITS;
  readonly volumeUnits: string[] = VOLUME_UNITS;
  readonly dimensionUnits: string[] = DIMENSION_UNITS;
  readonly widthUnits: string[] = WIDTH_UNITS;
  readonly lengthUnits: string[] = LENGTH_UNITS;
  readonly heightUnits: string[] = HEIGHT_UNITS;

  pair2Map: Pair2Map;
  pairs2: {key: string, value: string}[];

  constructor(private formBuilder: FormBuilder,
              private matDialogRef: MatDialogRef<DataEditorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ItemValueAndAttribute) {

    this.formControlStringAttributeValue = formBuilder.control('', [Validators.required]);
    this.formGroupStringAttribute = formBuilder.group({
      value: this.formControlStringAttributeValue
    });

    this.formControlTextAttributeValue = formBuilder.control('', [Validators.required]);
    this.formGroupTextAttribute = formBuilder.group({
      value: this.formControlTextAttributeValue
    });

    this.formControlNumberAttributeValue = formBuilder.control('', [Validators.required]);
    this.formGroupNumberAttribute = formBuilder.group({
      value: this.formControlNumberAttributeValue
    });

    this.formControlDateAttributeValue = formBuilder.control('', [Validators.required]);
    this.formGroupDateAttribute = formBuilder.group({
      value: this.formControlDateAttributeValue ,
    });

    this.formControlCurrencyAttributeValue = formBuilder.control('', [Validators.required]);
    this.formControlCurrencyAttributeCountry = formBuilder.control('', [Validators.required]);
    this.formGroupCurrencyAttribute = formBuilder.group({
      value: this.formControlCurrencyAttributeValue,
      country: this.formControlCurrencyAttributeCountry
    });

    this.formControlAreaAttributeValue = formBuilder.control('', [Validators.required]);
    this.formControlAreaAttributeUnit = formBuilder.control('', [Validators.required]);
    this.formGroupAreaAttribute = formBuilder.group({
      value: this.formControlAreaAttributeValue,
      unit: this.formControlAreaAttributeUnit
    });

    this.formControlVolumeAttributeValue = formBuilder.control('', [Validators.required]);
    this.formControlVolumeAttributeUnit = formBuilder.control('', [Validators.required]);
    this.formGroupVolumeAttribute = formBuilder.group({
      value: this.formControlVolumeAttributeValue,
      unit: this.formControlVolumeAttributeUnit
    });

    this.formControlDimensionAttributeWidthValue = formBuilder.control('', [Validators.required]);
    this.formControlDimensionAttributeHeightValue = formBuilder.control('', [Validators.required]);
    this.formControlDimensionAttributeLengthValue = formBuilder.control('', [Validators.required]);
    this.formControlDimensionAttributeUnit = formBuilder.control('', [Validators.required]);
    this.formGroupDimensionAttribute = formBuilder.group({
      unit: this.formControlDimensionAttributeUnit,
      width: this.formControlDimensionAttributeWidthValue,
      height: this.formControlDimensionAttributeHeightValue,
      length: this.formControlDimensionAttributeLengthValue
    });

    this.formControlWidthAttributeValue = formBuilder.control('', [Validators.required]);
    this.formControlWidthAttributeUnit = formBuilder.control('', [Validators.required]);
    this.formGroupWidthAttribtue = formBuilder.group({
      value: this.formControlWidthAttributeValue,
      unit: this.formControlWidthAttributeUnit
    });


    this.formControlHeightAttributeValue = formBuilder.control('', [Validators.required]);
    this.formControlHeightAttributeUnit = formBuilder.control('', [Validators.required]);
    this.formGroupHeightAttribute = formBuilder.group({
      value: this.formControlHeightAttributeValue,
      unit: this.formControlHeightAttributeUnit
    });

    this.formControlLengthAttributeValue = formBuilder.control('', [Validators.required]);
    this.formControlLengthAttribtueUnit = formBuilder.control('', [Validators.required]);
    this.formGroupLengthAttribute = formBuilder.group({
      value: this.formControlLengthAttributeValue,
      unit: this.formControlLengthAttribtueUnit
    });

    this.formControlSelectAttributeKey = formBuilder.control('', [Validators.required]);
    this.formGroupSelectAttribute = formBuilder.group({
      key: this.formControlSelectAttributeKey
    });

    this.formControlDoubleSelectKey1 = formBuilder.control('', [Validators.required]);
    this.formControlDoubleSelectKey2 = formBuilder.control('', [Validators.required]);
    this.formGroupDoubleSelectAttribute = formBuilder.group({
      key1: this.formControlDoubleSelectKey1,
      key2: this.formControlDoubleSelectKey2
    });


    const attanditem: ItemValueAndAttribute = data;
    const attribute: Attribute = attanditem.attribute;
    const itemValue: Value = attanditem.itemValue ? attanditem.itemValue : { attributeId: attribute.id, val: undefined };
    switch (data.attribute.type) {
      case 'string':
        let stringVal: StringValue = itemValue.val as StringValue;
        if (!stringVal) {
          stringVal = { type: 'string', value: '' } as StringValue;
          itemValue.val = stringVal;
        }
        this.formControlStringAttributeValue.setValue(stringVal.value);
        break;
      case 'text':
        let textVal: TextValue = itemValue.val as TextValue;
        if (!textVal) {
          textVal = { type: 'text', value: ''} as TextValue;
          itemValue.val = textVal;
        }
        this.formControlTextAttributeValue.setValue(textVal.value);
        break;
      case 'number':
        let numberVal: NumberValue = itemValue.val as NumberValue;
        if (!numberVal) {
          numberVal = { type: 'number', value: undefined };
          itemValue.val = numberVal;
        }
        this.formControlNumberAttributeValue.setValue(numberVal.value);
        break;
      case 'date':
        let dateVal: DateValue = itemValue.val as DateValue;
        if (!dateVal) {
          dateVal = { type: 'date', value: undefined };
          itemValue.val = dateVal;
        }
        const m = moment(dateVal.value, attribute.format ? attribute.format : DATE_FORMAT);
        this.formControlDateAttributeValue.setValue(m);
        break;
      case 'currency':
        let currencyVal: CurrencyValue = itemValue.val as CurrencyValue;
        if (!currencyVal) {
          currencyVal = { type: 'currency', country: undefined, value: undefined };
          itemValue.val = currencyVal;
        }
        this.formControlCurrencyAttributeValue.setValue(currencyVal.value);
        this.formControlCurrencyAttributeCountry.setValue(currencyVal.country);
        break;
      case 'volume':
        let volumeVal: VolumeValue = itemValue.val as VolumeValue;
        if (!volumeVal) {
          volumeVal = { type: 'volume', value: undefined, unit: undefined};
          itemValue.val = volumeVal;
        }
        this.formControlVolumeAttributeValue.setValue(volumeVal.value);
        this.formControlVolumeAttributeUnit.setValue(volumeVal.unit);
        break;
      case 'dimension':
        let dimensionVal: DimensionValue = itemValue.val as DimensionValue;
        if (!dimensionVal) {
          dimensionVal = { type: 'dimension', length: undefined, width: undefined, height: undefined, unit: undefined};
          itemValue.val = dimensionVal;
        }
        this.formControlDimensionAttributeWidthValue.setValue(dimensionVal.width);
        this.formControlDimensionAttributeHeightValue.setValue(dimensionVal.height);
        this.formControlDimensionAttributeLengthValue.setValue(dimensionVal.length);
        this.formControlDimensionAttributeUnit.setValue(dimensionVal.unit);
        break;
      case 'area':
        let areaVal: AreaValue = itemValue.val as AreaValue;
        if (!areaVal) {
          areaVal = { type: 'area', value: undefined, unit: undefined};
          itemValue.val = areaVal;
        }
        this.formControlAreaAttributeValue.setValue(areaVal.value);
        this.formControlAreaAttributeUnit.setValue(areaVal.unit);
        break;
      case 'width':
        let widthVal: WidthValue = itemValue.val as WidthValue;
        if (!widthVal) {
          widthVal = { type: 'width', value: undefined, unit: undefined };
          itemValue.val = widthVal;
        }
        this.formControlWidthAttributeValue.setValue(widthVal.value);
        this.formControlWidthAttributeUnit.setValue(widthVal.unit);
        break;
      case 'length':
        let lengthVal: LengthValue = itemValue.val as LengthValue;
        if (!lengthVal) {
          lengthVal = { type: 'length', value: undefined, unit: undefined };
          itemValue.val = lengthVal;
        }
        this.formControlLengthAttributeValue.setValue(lengthVal.value);
        this.formControlLengthAttribtueUnit.setValue(lengthVal.unit);
        break;
      case 'height':
        let heightVal: HeightValue = itemValue.val as HeightValue;
        if (!heightVal) {
          heightVal = { type: 'height', value: undefined, unit: undefined};
          itemValue.val = heightVal;
        }
        this.formControlHeightAttributeValue.setValue(heightVal.value);
        this.formControlHeightAttributeUnit.setValue(heightVal.unit);
        break;
      case 'select':
        let selectVal: SelectValue = itemValue.val as SelectValue;
        if (!selectVal) {
          selectVal = { type: 'select', key: undefined } as SelectValue;
          itemValue.val = selectVal;
        }
        this.formControlSelectAttributeKey.setValue(selectVal.key);
        break;
      case 'doubleselect':
        let doubleSelectVal: DoubleSelectValue = itemValue.val as DoubleSelectValue;
        if (!doubleSelectVal) {
          doubleSelectVal = { type: 'doubleselect', key1: undefined, key2: undefined };
          itemValue.val = doubleSelectVal;
        }
        this.formControlDoubleSelectKey1.setValue(doubleSelectVal.key1);
        this.formControlDoubleSelectKey2.setValue(doubleSelectVal.key2);
        break;
    }

    if (data.attribute.type === 'doubleselect') {
      this.pair2Map = doubleSelectToObjectMap(data.attribute);
    }
  }

  onEditDone() {
    console.log('**** onEditDone ', this.data);
    const attanditem: ItemValueAndAttribute = this.data;
    const attribute: Attribute = attanditem.attribute;
    const value: Value = attanditem.itemValue;
    switch (attanditem.attribute.type) {
      case 'string':
        setItemStringValue(attribute, value, this.formControlStringAttributeValue.value);
        break;
      case 'text':
        setItemTextValue(attribute, value, this.formControlTextAttributeValue.value);
        break;
      case 'number':
        setItemNumberValue(attribute, value, this.formControlNumberAttributeValue.value);
        break;
      case 'date':
        let dateInStringFormat = '';
        const format = attanditem.attribute.format ? attanditem.attribute.format : DATE_FORMAT;
        if (moment.isMoment(this.formControlDateAttributeValue.value)) {
          dateInStringFormat = this.formControlDateAttributeValue.value ?
              this.formControlDateAttributeValue.value.format(format) : '';
        } else if (typeof this.formControlDateAttributeValue.value === 'string') {
          dateInStringFormat = moment((this.formControlDateAttributeValue.value), format).format(format);
        }
        setItemDateValue(attribute, value, dateInStringFormat);
        break;
      case 'currency':
        setItemCurrencyValue(attribute, value, this.formControlCurrencyAttributeValue.value,
          this.formControlCurrencyAttributeCountry.value);
        break;
      case 'volume':
        setItemVolumeValue(attribute, value, this.formControlVolumeAttributeValue.value, this.formControlVolumeAttributeUnit.value);
        break;
      case 'dimension':
        setItemDimensionValue(
            attribute,
            value,
            this.formControlDimensionAttributeLengthValue.value,
            this.formControlDimensionAttributeWidthValue.value,
            this.formControlDimensionAttributeHeightValue.value,
            this.formControlDimensionAttributeUnit.value);
        break;
      case 'area':
        setItemAreaValue(attribute, value, this.formControlAreaAttributeValue.value, this.formControlAreaAttributeUnit.value);
        break;
      case 'width':
        setItemWidthValue(attribute, value, this.formControlWidthAttributeValue.value, this.formControlWidthAttributeUnit.value);
        break;
      case 'length':
        setItemLengthValue(attribute, value, this.formControlLengthAttributeValue.value, this.formControlLengthAttribtueUnit.value);
        break;
      case 'height':
        setItemHeightValue(attribute, value, this.formControlHeightAttributeValue.value, this.formControlHeightAttributeUnit.value);
        break;
      case 'select':
        setItemSelectValue(attribute, value, this.formControlSelectAttributeKey.value);
        break;
      case 'doubleselect':
        setItemDoubleSelectValue(attribute, value, this.formControlDoubleSelectKey1.value, this.formControlDoubleSelectKey2.value);
        break;
    }
    this.matDialogRef.close(attanditem);
  }

  onEditCancel($event: MouseEvent) {
    this.matDialogRef.close(null);
  }

  onDoubleSelectPair1Change($event: MatOptionSelectionChange) {
    if ($event && $event.source && $event.source.value && $event.isUserInput) {
      const pair1Key: string = $event.source.value;
      this.pairs2 = this.pair2Map[pair1Key];
    }
  }
}
