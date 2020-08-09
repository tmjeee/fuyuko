import {Component, Input, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {View} from "../../model/view.model";
import {
    CustomBulkEdit,
    CustomBulkEditScriptInputValue, CustomBulkEditScriptJobSubmissionResult,
    CustomBulkEditScriptPreview, CustomBulkEditScriptValidateResult
} from "../../model/custom-bulk-edit.model";
import {Observable} from "rxjs";
import {CustomBulkEditListComponentEvent} from "./custom-bulk-edit-list.component";
import {CustomBulkEditInputFormComponentEvent} from "./custom-bulk-edit-input-form.component";
import {CustomBulkEditPreviewComponentEvent} from "./custom-bulk-edit-preview.component";

export type CustomBulkEditFormValidateFn = (v: View, c: CustomBulkEdit, i: CustomBulkEditScriptInputValue[]) => Observable<CustomBulkEditScriptValidateResult>;
export type CustomBulkEditPreviewFn  = (v: View, c: CustomBulkEdit, i: CustomBulkEditScriptInputValue[]) => Observable<CustomBulkEditScriptPreview>;
export type CustomBulkEditSubmitFn  =  (v: View, c: CustomBulkEdit, p: CustomBulkEditScriptPreview, i: CustomBulkEditScriptInputValue[]) => Observable<CustomBulkEditScriptJobSubmissionResult>;

@Component({
    selector: 'app-custom-bulk-edit-wizard',
    templateUrl: './custom-bulk-edit-wizard.component.html',
    styleUrls: ['./custom-bulk-edit-wizard.component.scss']
})
export class CustomBulkEditWizardComponent {

    @Input() customBulkEdits: CustomBulkEdit[];
    @Input() customBulkEditFormValidateFn: CustomBulkEditFormValidateFn;
    @Input() customBulkEditPreviewFn: CustomBulkEditPreviewFn
    @Input() customBulkEditSubmitFn: CustomBulkEditSubmitFn;

    step1Ready: boolean;
    firstStepFormGroup: FormGroup;
    formControlCustomBulkEdit: FormControl;

    step2Ready: boolean;
    secondStepFormGroup: FormGroup;
    formControlView: FormControl;

    step3Ready: boolean;
    thirdStepFormGroup: FormGroup;
    formControlCustomBulkEditInputValues: FormControl;

    step4Ready: boolean;
    fourthStepFormGroup: FormGroup;
    formControlCustomBulkEditPreview: FormControl;

    step5Ready: boolean;
    fifthStepFormGroup: FormGroup;

    @ViewChild('stepper') stepper: MatStepper;

    constructor(private formBuilder: FormBuilder) {

        // first step
        this.step1Ready = true;
        this.formControlCustomBulkEdit = formBuilder.control('', [Validators.required]);
        this.firstStepFormGroup = formBuilder.group({
            'customBulkEdit': this.formControlCustomBulkEdit
        });

        // second step
        this.step2Ready = false;
        this.formControlView = formBuilder.control('', [Validators.required]);
        this.secondStepFormGroup = formBuilder.group({
            'view': this.formControlView
        });

        // third step
        this.step3Ready = false;
        this.formControlCustomBulkEditInputValues = formBuilder.control('', [Validators.required]);
        this.thirdStepFormGroup = formBuilder.group({
            'customBulkEditInputValues':  this.formControlCustomBulkEditInputValues
        });

        // fourth step
        this.step4Ready = false;
        this.formControlCustomBulkEditPreview = formBuilder.control('', [Validators.required]);
        this.fourthStepFormGroup = formBuilder.group({
            'preview': this.formControlCustomBulkEditPreview
        });

        // fifth step
        this.step5Ready = false;
        this.fifthStepFormGroup = formBuilder.group({});
    }

    onCustomBulkEditListEvent($event: CustomBulkEditListComponentEvent) {
        this.formControlCustomBulkEdit.setValue($event.customBulkEdit);
    }

    onViewSelectorEvent($event: View) {
        this.formControlView.setValue($event);
    }

    onCustomBulkEditFormEvent($event: CustomBulkEditInputFormComponentEvent) {
        if ($event.validationResult.valid) {
            this.formControlCustomBulkEditInputValues.setValue($event.inputValues);
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
        const d: CustomBulkEdit = this.formControlCustomBulkEdit.value;

        this.step1Ready = true;
        this.step2Ready = false;
        this.step3Ready = false;
        this.step4Ready = false;
        this.step5Ready = false;
        this.stepper.reset();

        this.formControlCustomBulkEdit.setValue(d); // restore to whatever it is before we go back to step 1
    }

    onCustomBulkEditPreviewEvent($event: CustomBulkEditPreviewComponentEvent) {
        this.formControlCustomBulkEditPreview.setValue($event.preview);
    }

}