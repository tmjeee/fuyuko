import {Component, ElementRef, Input, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {View} from '../../model/view.model';
import {
    AttributeDataImport,
    DataImport,
    ItemDataImport,
    PriceDataImport,
    UploadType
} from '../../model/data-import.model';
import {Observable} from 'rxjs';
import {Job} from '../../model/job.model';
import {tap} from 'rxjs/operators';
import {MatStepper} from '@angular/material/stepper';
import {MatSelectChange} from '@angular/material/select';

export type ShowPreviewFn =
    (uploadType: UploadType, file: File) => Observable<AttributeDataImport | ItemDataImport | PriceDataImport>;
export type SubmitDataImportFn =
    (uploadType: UploadType, dataImport: AttributeDataImport | ItemDataImport | PriceDataImport) => Observable<Job>;

@Component({
    selector: 'app-import-data',
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {

    firstFormGroup: FormGroup;
    viewFormControl: FormControl;

    secondFormGroup: FormGroup;
    uploadTypeFormControl: FormControl;
    fileUploadFormControl: FormControl;
    selectedUploadType: UploadType;
    attributeDataImport: AttributeDataImport;
    itemDataImport: ItemDataImport;
    priceDataImport: PriceDataImport;
    @ViewChild('fileUploadInputElement', {static: true}) fileUploadInputElement: ElementRef;

    thirdFormGroup: FormGroup;
    disableThirdForm: boolean;
    job: Job;

    fourthFormGroup: FormGroup;
    jobSubmitted: boolean;


    @Input() views: View[];
    @Input() showPreview: ShowPreviewFn;
    @Input() submitDataImport: SubmitDataImportFn;

    constructor(private formBuilder: FormBuilder) {
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

    onUploadTypeSelectionChanged($event: MatSelectChange) {
        this.selectedUploadType = $event.value;
    }

    onUploadDataFileChange(files: FileList) {
        if (files && files.length) {
            this.fileUploadFormControl.setValue(files.item(0));
        } else {
            this.fileUploadFormControl.setValue(undefined);
        }
    }

    onFirstFormSubmit() {
    }

    onSecondFormSubmit() {
        const file: File = this.fileUploadFormControl.value;
        this.showPreview(this.selectedUploadType, file)
            .pipe(
                tap((dataImport: AttributeDataImport | PriceDataImport | ItemDataImport) => {
                    switch(dataImport.type) {
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
                })
            ).subscribe();
    }

    onThirdFormSubmit() {
        this.jobSubmitted = false;
        let dataImport: AttributeDataImport | ItemDataImport | PriceDataImport = null;
        switch (this.selectedUploadType) {
            case 'attribute':
                dataImport = this.attributeDataImport;
                break;
            case 'price':
                dataImport = this.priceDataImport;
                break;
            case 'item':
                dataImport = this.itemDataImport;
                break;
        }
        this.submitDataImport(this.selectedUploadType, dataImport)
            .pipe(
                tap((j: Job) => {
                    this.job = j;
                    this.jobSubmitted = true;
                })
            ).subscribe();
    }

    onFourthFormSubmit(stepper: MatStepper) {
        if (this.fileUploadInputElement) {
            this.fileUploadInputElement.nativeElement.value = '';
        }
        stepper.reset();
    }

}

