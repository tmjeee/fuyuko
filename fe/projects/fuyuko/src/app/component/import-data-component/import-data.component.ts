import {Component, ElementRef, Input, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {View} from '@fuyuko-common/model/view.model';
import {
    AttributeDataImport, DataImportType,
    ItemDataImport,
    PriceDataImport,
} from '@fuyuko-common/model/data-import.model';
import {Observable} from 'rxjs';
import {Job} from '@fuyuko-common/model/job.model';
import {tap} from 'rxjs/operators';
import {MatStepper} from '@angular/material/stepper';
import {MatSelectChange} from '@angular/material/select';

export type ShowPreviewFn =
    (viewId: number, uploadType: DataImportType, file: File) => Observable<AttributeDataImport | ItemDataImport | PriceDataImport>;
export type SubmitDataImportFn =
    (viewId: number, uploadType: DataImportType, dataImport: AttributeDataImport | ItemDataImport | PriceDataImport) => Observable<Job>;

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
    selectedUploadType?: DataImportType;
    attributeDataImport?: AttributeDataImport;
    itemDataImport?: ItemDataImport;
    priceDataImport?: PriceDataImport;

    @ViewChild('fileUploadInputElement', {static: true}) fileUploadInputElement!: ElementRef;

    thirdFormGroup: FormGroup;
    disableThirdForm: boolean;
    job?: Job;

    fourthFormGroup: FormGroup;
    jobSubmitted: boolean;


    @Input() views: View[] = [];
    @Input() showPreview!: ShowPreviewFn;
    @Input() submitDataImport!: SubmitDataImportFn;

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

    onUploadDataFileChange($event: Event) {
        const inputElement: HTMLInputElement = $event.target as HTMLInputElement;
        const files: FileList | null = inputElement.files;
        if (files && files.length) {
            this.fileUploadFormControl.setValue(files.item(0));
        } else {
            this.fileUploadFormControl.setValue(undefined);
        }
    }

    onFirstFormSubmit() {
    }

    onSecondFormSubmit() {
        const view: View = this.viewFormControl.value;
        const file: File = this.fileUploadFormControl.value;
        if (this.selectedUploadType) {
            this.showPreview(view.id, this.selectedUploadType, file)
                .pipe(
                    tap((dataImport: AttributeDataImport | PriceDataImport | ItemDataImport) => {
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
                    })
                ).subscribe();
        }
    }

    onThirdFormSubmit() {
        this.jobSubmitted = false;
        const view: View = this.viewFormControl.value;
        let body: any = {};
        switch (this.selectedUploadType) {
            case 'ATTRIBUTE': {
                if (this.attributeDataImport?.dataImportId && this.attributeDataImport.attributes) {
                    const body2: AttributeDataImport = {
                        type: 'ATTRIBUTE',
                        messages: {
                            infos: [],
                            warnings: [],
                            errors: []
                        },
                        dataImportId: this.attributeDataImport.dataImportId,
                        attributes: this.attributeDataImport.attributes
                    };
                    body = body2;
                }
                break;
            }
            case 'PRICE': {
                if (this.priceDataImport?.dataImportId && this.priceDataImport.items) {
                    const body2: PriceDataImport = {
                        type: 'PRICE',
                        messages: {
                            infos: [],
                            warnings: [],
                            errors: []
                        },
                        dataImportId: this.priceDataImport.dataImportId,
                        items: this.priceDataImport.items
                    };
                    body = body2;
                }
                break;
            }
            case 'ITEM': {
                if (this.itemDataImport?.attributes && this.itemDataImport.dataImportId && this.itemDataImport.items) {
                    const body2: ItemDataImport = {
                        type: 'ITEM',
                        messages: {
                            infos: [],
                            warnings: [],
                            errors: []
                        },
                        attributes: this.itemDataImport.attributes,
                        dataImportId: this.itemDataImport.dataImportId,
                        items: this.itemDataImport.items
                    };
                    body = body2;
                }
                break;
            }
        }
        if (this.selectedUploadType) {
            this.submitDataImport(view.id, this.selectedUploadType, body)
                .pipe(
                    tap((j: Job) => {
                        this.job = j;
                        this.jobSubmitted = true;
                    })
                ).subscribe();
        }
    }

    onFourthFormSubmit(stepper: MatStepper) {
        if (this.fileUploadInputElement) {
            this.fileUploadInputElement.nativeElement.value = '';
        }
        stepper.reset();
    }

}

