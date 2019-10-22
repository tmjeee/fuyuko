import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {View} from '../../model/view.model';
import {Observable, of} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {Item, Value} from '../../model/item.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {formatCurrency} from '@angular/common';
import {tap} from 'rxjs/operators';
import {MatRadioChange} from '@angular/material/radio';
import {MatHorizontalStepper} from '@angular/material/stepper';
import {Job} from '../../model/job.model';
import {DataExport} from '../../model/data-export.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {convertToString} from '../../utils/ui-item-value-converters.util';

export type ViewAttributeFn = (viewId: number) => Observable<Attribute[]>;
export type ViewItemsFn = (viewId: number, whereClauses: ItemValueOperatorAndAttribute[]) => Observable<Item[]>;
export type SubmitExportJobFn = (viewId: number, attributes: Attribute[], filter: ItemValueOperatorAndAttribute[]) => Observable<Job>;
export type PreviewExportFn = (viewId: number, attributes: Attribute[], filter: ItemValueOperatorAndAttribute[]) => Observable<DataExport>;

@Component({
   selector: 'app-export-data',
   templateUrl: './export-data.component.html',
   styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {

    @Input() views: View[];
    @Input() viewAttributesFn: ViewAttributeFn;
    @Input() viewItemsFn: ViewItemsFn;
    @Input() previewExportFn: PreviewExportFn;
    @Input() submitExportJobFn: SubmitExportJobFn;


    // 1: select view
    firstFormGroup: FormGroup;
    viewFormControl: FormControl;

    // 2: select attribute
    secondFormGroup: FormGroup;
    secondFormReady: boolean;
    attributeSelectionOptionFormControl: FormControl;
    currentAttributeSelectionOption: string;
    allAttributes: Attribute[];

    // 3: items filtering
    thirdFormGroup: FormGroup;
    itemFilterCounter = 1;
    itemValueOperatorAndAttributeList: ItemValueOperatorAndAttribute[];

    // 4. review export
    fourthFormGroup: FormGroup;
    fourthFormReady: boolean;
    dataExport: DataExport;


    // 5: submit job
    fifthFormGroup: FormGroup;
    job: Job;
    jobSubmitted: boolean;

    constructor(private formBuilder: FormBuilder,
                private changeDetectorRef: ChangeDetectorRef) {
        this.viewFormControl = formBuilder.control(undefined, [Validators.required]);
        this.firstFormGroup = formBuilder.group({
            view: this.viewFormControl
        });

        this.secondFormReady = false;
        this.currentAttributeSelectionOption = 'all';
        this.attributeSelectionOptionFormControl = formBuilder.control('all', [Validators.required]);
        this.secondFormGroup = formBuilder.group({
            attributeSelectionOption: this.attributeSelectionOptionFormControl
        });
        this.secondFormGroup.setValidators((c: AbstractControl) => {
            const attributesFormGroup: FormGroup = c.get('attributes') as FormGroup;
            if (attributesFormGroup) {
                if (this.attributeSelectionOptionFormControl.value === 'selection') {
                    const valid = Object.values(attributesFormGroup.controls).reduce((r: boolean, ctl: AbstractControl) => {
                        console.log('ctl', ctl.value);
                        return (r || ctl.value);
                    }, false);
                    console.log('***************** att validator', valid);
                    if (!valid) {
                        return {selectAtLeastOneAttribute: true};
                    }
                }
            }
            return null;
        });

        this.itemValueOperatorAndAttributeList = [];
        this.thirdFormGroup = formBuilder.group({ });

        this.fourthFormReady = false;
        this.dataExport = null;
        this.fourthFormGroup = formBuilder.group({});

        this.jobSubmitted = false;
        this.job = null;
        this.fifthFormGroup = formBuilder.group({ });
    }

    ngOnInit(): void {
    }

    onFirstFormSubmit() {
        this.secondFormReady = false;
        const viewId: number = this.viewFormControl.value;
        this.viewAttributesFn(viewId)
            .pipe(
                tap((a: Attribute[]) => {
                        this.allAttributes = a;
                        const attributesFormGroup: FormGroup = this.formBuilder.group({});
                        this.secondFormGroup.removeControl('attributes');
                        this.secondFormGroup.setControl('attributes', attributesFormGroup);
                        this.allAttributes.forEach((ia: Attribute) => {
                            const control: FormControl = this.formBuilder.control(false);
                            (control as any).internalData = ia;
                            attributesFormGroup.setControl('' + ia.id, control);
                        });
                        this.secondFormReady = true;

                })
            ).subscribe();
    }

    onAttributeSelectionOptionChange($event: MatRadioChange) {
        this.currentAttributeSelectionOption = $event.value;
        this.secondFormGroup.updateValueAndValidity();
    }

    onSecondFormSubmit() {

    }

    onThirdFormSubmit() {
        this.fourthFormReady = false;

        // figure out view id (from step 1)
        const viewId: number = this.viewFormControl.value;

        // figure out attributes (from step 2)
        let att: Attribute[] = null;
        if (this.currentAttributeSelectionOption  === 'selection') {
            att = [];
            const fg: FormGroup = this.secondFormGroup.get('attributes') as FormGroup;
            for (const [, c] of Object.entries(fg.controls)) {
                const a: Attribute = (c as any).internalData;
                att.push(a);
            }
        }

        // figure out item filters (from step 3)
        const f: ItemValueOperatorAndAttribute[] = this.itemValueOperatorAndAttributeList;

        this.previewExportFn(viewId, att, f).pipe(
            tap((dataExport: DataExport) => {
                this.dataExport = dataExport;
                this.fourthFormReady = true;
            })
        ).subscribe();
    }

    onFourthFormSubmit() {
        // figure out view id (from step 1)
        const viewId: number = this.viewFormControl.value;

        // figure out attributes (from step 2)
        let att: Attribute[] = null;
        if (this.currentAttributeSelectionOption  === 'selection') {
            att = [];
            const fg: FormGroup = this.secondFormGroup.get('attributes') as FormGroup;
            for (const [, c] of Object.entries(fg.controls)) {
                const a: Attribute = (c as any).internalData;
                att.push(a);
            }
        }

        // figure out item filters (from step 3)
        const f: ItemValueOperatorAndAttribute[] = this.itemValueOperatorAndAttributeList;


        this.jobSubmitted = false;
        this.submitExportJobFn(viewId, att, f).pipe(
            tap((j: Job) => {
                this.job = j;
                this.jobSubmitted = true;
            })
        ).subscribe();
    }

    onFifthFormSubmit(stepper: MatHorizontalStepper) {
        stepper.reset();
    }

    onAttributeOperatorEvent($event: ItemValueOperatorAndAttribute, orig: ItemValueOperatorAndAttribute) {
        const id = (orig as any).id;
        const g: FormGroup = this.thirdFormGroup.get('' + id) as FormGroup;
        (g.get('attribute') as FormControl).setValue($event.attribute);
        (g.get('operator') as FormControl).setValue($event.operator);
        (g.get('itemValue') as FormControl).setValue($event.attribute ? convertToString($event.attribute, $event.itemValue) : undefined);
        this.thirdFormGroup.updateValueAndValidity();
    }

    onAddItemFilter($event: MouseEvent) {
        const id = this.itemFilterCounter++;
        const i: ItemValueOperatorAndAttribute = {
            id,
            attribute: null,
            operator: null,
            itemValue: null
        } as ItemValueOperatorAndAttribute;
        this.itemValueOperatorAndAttributeList.push(i);
        const g: FormGroup = this.formBuilder.group({
            attribute: this.formBuilder.control(null, [Validators.required]),
            operator: this.formBuilder.control(null, [Validators.required]),
            itemValue: this.formBuilder.control(null, [Validators.required])
        });
        this.thirdFormGroup.setControl('' + (i as any).id, g);
    }

    onDeleteItemFilter($event: MouseEvent, itemValueOperatorAndAttribute: ItemValueOperatorAndAttribute) {
        this.itemValueOperatorAndAttributeList =
            this.itemValueOperatorAndAttributeList.filter((i: ItemValueOperatorAndAttribute) => i !== itemValueOperatorAndAttribute);
        this.thirdFormGroup.removeControl('' + (itemValueOperatorAndAttribute as any).id);
    }

    onAttributeCheckboxChange($event: MatCheckboxChange) {
        this.secondFormGroup.updateValueAndValidity();
        this.changeDetectorRef.detectChanges();
    }
}
