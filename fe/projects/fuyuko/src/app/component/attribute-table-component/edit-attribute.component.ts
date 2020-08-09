import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Attribute, ATTRIBUTE_TYPES} from '../../model/attribute.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SingleSelectComponent} from './single-select.component';
import {dateFormatValidator, numberFormatValidator} from '../../service/custom-validators';
import {MatSelectChange} from '@angular/material/select';

export interface EditAttributeComponentEvent {
    type: 'update' | 'cancel';
    attribute?: Attribute; // only valid when 'update'
}

@Component({
    selector: 'app-edit-attribute',
    templateUrl: './edit-attribute.component.html',
    styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent implements OnChanges {

    @Input() attribute: Attribute;

    @Output() events: EventEmitter<EditAttributeComponentEvent>;

    attributeTypes = ATTRIBUTE_TYPES;

    formGroupCommon: FormGroup;
    formControlAttributeName: FormControl;
    formControlAttributeDescription: FormControl;
    formControlAttributeType: FormControl;

    formGroupNumberAttribute: FormGroup;
    formControlNumberAttributeFormat: FormControl;

    formGroupDateAttribute: FormGroup;
    formControlDateAttributeFormat: FormControl;

    formGroupCurrencyAttribute: FormGroup;
    formControlCurrencyAttributeCountry: FormControl;

    formGroupDimensionAttribute: FormGroup;
    formControlDimensionAttributeFormat: FormControl;

    formGroupVolumeAttribute: FormGroup;
    formControlVolumeAttributeFormat: FormControl;

    formGroupAreaAttribute: FormGroup;
    formControlAreaAttributeFormat: FormControl;

    formGroupWidthAttribute: FormGroup;
    formControlWidthAttributeFormat: FormControl;

    formGroupWeightAttribute: FormGroup;
    formControlWeightAttributeFormat: FormControl;

    formGroupHeightAttribute: FormGroup;
    formControlHeightAttributeFormat: FormControl;

    formGroupLengthAttribtue: FormGroup;
    formControlLengthAttributeFormat: FormControl;

    @ViewChild('singleSelectComponent') singleSelectComponent: SingleSelectComponent;


    isFormValid: boolean;

    currentSelectedAttributeType: string;

    constructor(private formBuilder: FormBuilder) {
        this.events = new EventEmitter<EditAttributeComponentEvent>();

        this.formControlAttributeName = this.formBuilder.control('', [Validators.required]);
        this.formControlAttributeDescription = this.formBuilder.control('', [Validators.required]);
        this.formControlAttributeType = this.formBuilder.control('', [Validators.required]);
        this.formGroupCommon = this.formBuilder.group({
            name: this.formControlAttributeName,
            description: this.formControlAttributeDescription,
            type: this.formControlAttributeType
        });

        this.formControlNumberAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupNumberAttribute = this.formBuilder.group({
            format: this.formControlNumberAttributeFormat,
        });

        this.formControlDateAttributeFormat = this.formBuilder.control('', [dateFormatValidator]);
        this.formGroupDateAttribute = this.formBuilder.group({
            format: this.formControlDateAttributeFormat
        });

        this.formControlCurrencyAttributeCountry = this.formBuilder.control('');
        this.formGroupCurrencyAttribute = this.formBuilder.group({
            country: this.formControlCurrencyAttributeCountry
        });

        this.formControlDimensionAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupDimensionAttribute = this.formBuilder.group({
            format: this.formControlDimensionAttributeFormat,
        });

        this.formControlVolumeAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupVolumeAttribute = this.formBuilder.group({
            format: this.formControlVolumeAttributeFormat,
        });

        this.formControlAreaAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupAreaAttribute = this.formBuilder.group({
            format: this.formControlAreaAttributeFormat,
        });

        this.formControlWidthAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupWidthAttribute = this.formBuilder.group({
            format: this.formControlWidthAttributeFormat,
        });

        this.formControlWeightAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupWeightAttribute = this.formBuilder.group({
            format: this.formControlWeightAttributeFormat,
        });

        this.formControlHeightAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupHeightAttribute =  this.formBuilder.group({
            format: this.formControlHeightAttributeFormat,
        });

        this.formControlLengthAttributeFormat = this.formBuilder.control('', [numberFormatValidator]);
        this.formGroupLengthAttribtue = this.formBuilder.group({
            format: this.formControlLengthAttributeFormat
        });
    }

    onAttributeTypeChange($event: MatSelectChange) {
        const attributeType: string = $event.value;
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
            case 'weight':
                this.formGroupCommon.setControl('misc', this.formGroupWeightAttribute);
                break;
            case 'length':
                this.formGroupCommon.setControl('misc', this.formGroupLengthAttribtue);
                break;
            case 'select':
                // done in single-select-component.ts upon initialization
                const a = {...this.attribute};
                a.pair1 = [
                    {id: -1, key: '', value: ''}
                ];
                this.attribute = a;
                break;
            case 'doubleselect':
                // done in double-select-component.ts upon initialization
                this.attribute = {...this.attribute};
                this.attribute.pair2 = [
                    {id: -1, key1: '', key2:'', value: '', }
                ];
                break;
        }
    }

    onSubmit() {
        const att: Attribute = { ...this.attribute };
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
            case 'weight':
                att.format = this.formControlWeightAttributeFormat.value;
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
        this.events.emit({
            type: 'update',
            attribute: att
        } as EditAttributeComponentEvent);
    }

    async onCancelClicked($event: MouseEvent) {
        this.events.emit({
           type: 'cancel'
        } as EditAttributeComponentEvent);
    }

    reload() {
        const attribute = this.attribute;
        this.currentSelectedAttributeType = attribute.type;
        this.formControlAttributeName.setValue(attribute.name);
        this.formControlAttributeDescription.setValue(attribute.description);
        this.formControlAttributeType.setValue(attribute.type);

        if (attribute.type === 'number') {
            this.formControlNumberAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'date') {
            this.formControlDateAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'currency') {
            this.formControlCurrencyAttributeCountry.setValue(attribute.showCurrencyCountry);
        }

        if (attribute.type === 'dimension') {
            this.formControlDimensionAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'volume') {
            this.formControlVolumeAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'area') {
            this.formControlAreaAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'width') {
            this.formControlWidthAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'height') {
            this.formControlHeightAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'weight') {
            this.formControlWeightAttributeFormat.setValue(attribute.format);
        }

        if (attribute.type === 'length') {
            this.formControlLengthAttributeFormat.setValue(attribute.format);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.attribute) {
            const att: Attribute = changes.attribute.currentValue;
            if (att) {
                this.reload();
            }
        }
    }

    isDisabled() {
        setTimeout(() => this.formGroupCommon.disabled);
    }
}

