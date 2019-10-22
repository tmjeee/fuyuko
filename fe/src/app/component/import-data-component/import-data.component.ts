import {Component, ElementRef, Input, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {View} from '../../model/view.model';
import {DataImport} from '../../model/data-import.model';
import {Observable} from 'rxjs';
import {Job} from '../../model/job.model';
import {tap} from 'rxjs/operators';
import {MatStepper} from '@angular/material/stepper';

export type ShowPreviewFn = (file: File) => Observable<DataImport>;
export type SubmitDataImportFn = (dataImport: DataImport) => Observable<Job>;

@Component({
    selector: 'app-import-data',
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {

    firstFormGroup: FormGroup;
    viewFormControl: FormControl;

    secondFormGroup: FormGroup;
    fileUploadFormControl: FormControl;
    dataImport: DataImport;
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
        this.fileUploadFormControl = formBuilder.control(undefined, [Validators.required]);
        this.secondFormGroup = formBuilder.group({
            fileUpload: this.fileUploadFormControl
        });
        this.thirdFormGroup = formBuilder.group({});
        this.disableThirdForm = true;
        this.fourthFormGroup = formBuilder.group({});
        this.jobSubmitted = false;
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
        this.showPreview(file)
            .pipe(
                tap((dataImport: DataImport) => {
                    this.dataImport = dataImport;
                    this.disableThirdForm = !!(dataImport
                        && dataImport.messages && dataImport.messages.errors && dataImport.messages.errors.length);
                })
            ).subscribe();
    }

    onThirdFormSubmit() {
        this.jobSubmitted = false;
        this.submitDataImport(this.dataImport)
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

