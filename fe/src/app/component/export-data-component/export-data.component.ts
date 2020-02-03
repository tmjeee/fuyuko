import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {View} from '../../model/view.model';
import {forkJoin, Observable, } from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {tap} from 'rxjs/operators';
import {MatRadioChange} from '@angular/material/radio';
import {MatHorizontalStepper} from '@angular/material/stepper';
import {Job} from '../../model/job.model';
import {
    AttributeDataExport,
    DataExport,
    DataExportType,
    ItemDataExport,
    PriceDataExport
} from '../../model/data-export.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {convertToString} from '../../shared-utils/ui-item-value-converters.util';
import {MatSelectChange} from '@angular/material/select';
import {PricingStructure} from '../../model/pricing-structure.model';

export type ViewAttributeFn = (viewId: number) => Observable<Attribute[]>;
export type ViewPricingStructureFn = (viewId: number) => Observable<PricingStructure[]>;
export type PreviewExportFn = (exportType: DataExportType, viewId: number, attributes: Attribute[],
                               filter: ItemValueOperatorAndAttribute[],
                               ps?: PricingStructure /* only available when exportType === 'PRICE' */)
    => Observable<AttributeDataExport | ItemDataExport | PriceDataExport>;
export type SubmitExportJobFn = (exportType: DataExportType, viewId: number,
                                 attributes: Attribute[],
                                 dataExport: AttributeDataExport | ItemDataExport | PriceDataExport,
                                 filter: ItemValueOperatorAndAttribute[]) => Observable<Job>;

@Component({
   selector: 'app-export-data',
   templateUrl: './export-data.component.html',
   styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {

    @Input() views: View[];
    @Input() viewAttributesFn: ViewAttributeFn;
    @Input() viewPricingStructuresFn: ViewPricingStructureFn;
    @Input() previewExportFn: PreviewExportFn;
    @Input() submitExportJobFn: SubmitExportJobFn;


    // 1: select view
    firstFormGroup: FormGroup;
    viewFormControl: FormControl;

    // 2: select attribute
    secondFormGroup: FormGroup;
    secondFormReady: boolean;
    attributeSelectionOptionFormControl: FormControl;
    exportTypeFormControl: FormControl;
    pricingStructureFormControl: FormControl;
    currentAttributeSelectionOption: string;
    allAttributes: Attribute[];
    allPricingStructures: PricingStructure[];
    selectedExportType: DataExportType;
    selectedPricingStructure: PricingStructure;

    // 3: items filtering
    thirdFormGroup: FormGroup;
    itemFilterCounter = 1;
    itemValueOperatorAndAttributeList: ItemValueOperatorAndAttribute[];

    // 4. review export
    fourthFormGroup: FormGroup;
    fourthFormReady: boolean;
    dataExport: AttributeDataExport | ItemDataExport | PriceDataExport;


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
        this.exportTypeFormControl = formBuilder.control('', [Validators.required]);
        this.attributeSelectionOptionFormControl = formBuilder.control('all', [Validators.required]);
        this.secondFormGroup = formBuilder.group({
            exportType: this.exportTypeFormControl,
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


    onAttributeSelectionOptionChange($event: MatRadioChange) {
        this.currentAttributeSelectionOption = $event.value;
        this.secondFormGroup.updateValueAndValidity();
    }

    onFirstFormSubmit() {
        this.secondFormReady = false;
        const viewId: number = this.viewFormControl.value;
        forkJoin({
            a: this.viewAttributesFn(viewId),
            p: this.viewPricingStructuresFn(viewId)
        }).pipe(
            tap((r: {a: Attribute[], p: PricingStructure[]}) => {
                // attributes
               this.allAttributes = r.a;
               const attributesFormGroup: FormGroup = this.formBuilder.group({});
               this.secondFormGroup.removeControl('attributes');
               this.secondFormGroup.setControl('attributes', attributesFormGroup);
               this.allAttributes.forEach((ia: Attribute) => {
                   const control: FormControl = this.formBuilder.control(false);
                   (control as any).internalData = ia;
                   attributesFormGroup.setControl('' + ia.id, control);
               });

               // pricing structures
               this.allPricingStructures = r.p;
               this.pricingStructureFormControl = this.formBuilder.control(null);
               this.secondFormGroup.removeControl('pricingStructure');
               this.secondFormGroup.setControl('pricingStructure', this.pricingStructureFormControl);

               this.secondFormReady = true;
            })
        ).subscribe();
    }

    onSecondFormSubmit() {

    }

    onThirdFormSubmit() {
        this.fourthFormReady = false;

        // export type
        const exportType: DataExportType = this.exportTypeFormControl.value;

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
        const ps: PricingStructure = this.selectedExportType === 'PRICE' ? this.selectedPricingStructure : null;
        this.previewExportFn(exportType, viewId, att, f, ps).pipe(
            tap((dataExport: AttributeDataExport | ItemDataExport | PriceDataExport) => {
                this.dataExport = dataExport;
                this.fourthFormReady = true;
            })
        ).subscribe();
    }

    onFourthFormSubmit() {

        // export type
        const exportType: DataExportType = this.exportTypeFormControl.value;

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
        this.submitExportJobFn(exportType, viewId, att, this.dataExport, f).pipe(
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

    onExportTypeSelectionChanged($event: MatSelectChange) {
        this.selectedExportType = $event.value;
        if ($event.value === 'PRICE') {
            this.secondFormGroup.controls.pricingStructure.setValidators([Validators.required]);
        } else {
            this.secondFormGroup.controls.pricingStructure.clearValidators();
        }
        this.secondFormGroup.updateValueAndValidity()
    }

    onPricingStructureSelectionChanged($event: MatSelectChange) {
        this.selectedPricingStructure = $event.value;
    }
}
