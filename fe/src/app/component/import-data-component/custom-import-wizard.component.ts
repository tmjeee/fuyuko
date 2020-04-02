import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
    CustomDataImport,
    ImportScriptInputValue, ImportScriptJobSubmissionResult,
    ImportScriptPreview,
    ImportScriptValidateResult
} from "../../model/custom-import.model";
import {CustomImportListComponentEvent} from "./custom-import-list.component";
import {View} from "../../model/view.model";
import {CustomImportInputFormComponentEvent} from "./custom-import-input-form.component";
import {Observable} from "rxjs";
import {CustomImportPreviewComponentEvent} from "./custom-import-preview.component";
import {MatStepper} from "@angular/material/stepper";

export type CustomImportValidateFn = (c: CustomDataImport, i: ImportScriptInputValue[]) => Observable<ImportScriptValidateResult>;
export type CustomImportPreviewFn =  (v: View, c: CustomDataImport, i: ImportScriptInputValue[]) => Observable<ImportScriptPreview>;
export type CustomImportSubmitFn =  (v: View, c: CustomDataImport, p: ImportScriptPreview, i: ImportScriptInputValue[]) => Observable<ImportScriptJobSubmissionResult>;

@Component({
    selector: 'app-custom-import-wizard',
    templateUrl: './custom-import-wizard.component.html',
    styleUrls: ['./custom-import-wizard.component.scss']
})
export class CustomImportWizardComponent implements OnInit {

    @Input() customDataImports: CustomDataImport[];
    @Input() customInputFormValidateFn: CustomImportValidateFn;
    @Input() customImportPreviewFn: CustomImportPreviewFn
    @Input() customImportSubmitFn: CustomImportSubmitFn;

    step1Ready: boolean;
    firstStepFormGroup: FormGroup;
    formControlCustomDataImport: FormControl;

    step2Ready: boolean;
    secondStepFormGroup: FormGroup;
    formControlView: FormControl;

    step3Ready: boolean;
    thirdStepFormGroup: FormGroup;
    formControlCustomImportInputValues: FormControl;

    step4Ready: boolean;
    fourthStepFormGroup: FormGroup;
    formControlCustomImportPreview: FormControl;

    step5Ready: boolean;
    fifthStepFormGroup: FormGroup;

    @ViewChild('stepper') stepper: MatStepper;

    constructor(private formBuilder: FormBuilder) {

        // first step
        this.step1Ready = true;
        this.formControlCustomDataImport = formBuilder.control('', [Validators.required]);
        this.firstStepFormGroup = formBuilder.group({
            'customDataImport': this.formControlCustomDataImport
        });

        // second step
        this.step2Ready = false;
        this.formControlView = formBuilder.control('', [Validators.required]);
        this.secondStepFormGroup = formBuilder.group({
            'view': this.formControlView
        });

        // third step
        this.step3Ready = false;
        this.formControlCustomImportInputValues = formBuilder.control('', [Validators.required]);
        this.thirdStepFormGroup = formBuilder.group({
            'customImportInputValues':  this.formControlCustomImportInputValues
        });

        // fourth step
        this.step4Ready = false;
        this.formControlCustomImportPreview = formBuilder.control('', [Validators.required]);
        this.fourthStepFormGroup = formBuilder.group({
            'preview': this.formControlCustomImportPreview
        });

        // fifth step
        this.step5Ready = false;
        this.fifthStepFormGroup = formBuilder.group({});
    }

    ngOnInit(): void {
    }

    onCustomImportListEvent($event: CustomImportListComponentEvent) {
        this.formControlCustomDataImport.setValue($event.customDataImport);
    }

    onViewSelectorEvent($event: View) {
        this.formControlView.setValue($event);
    }

    onCustomImpotFormEvent($event: CustomImportInputFormComponentEvent) {
        if ($event.validationResult.valid) {
            this.formControlCustomImportInputValues.setValue($event.inputValues);
        }
    }

    onStep1Submit() {
        this.step2Ready = true;
    }

    onStep2Submit() {
        this.step3Ready = true;
    }

    onStep3Submit() {
        this.step4Ready = true;
    }

    onStep4Submit() {
        this.step5Ready = true;
    }

    onStep5Submit() {
        console.log('***** on step 5 submit', this.stepper);
        const d: CustomDataImport = this.formControlCustomDataImport.value;

        this.step1Ready = true;
        this.step2Ready = false;
        this.step3Ready = false;
        this.step4Ready = false;
        this.step5Ready = false;
        this.stepper.reset();

        this.formControlCustomDataImport.setValue(d); // restore to whatever it is before we go back to step 1
    }

    onCustomImportPreviewEvent($event: CustomImportPreviewComponentEvent) {
        this.formControlCustomImportPreview.setValue($event.preview);
    }
}
