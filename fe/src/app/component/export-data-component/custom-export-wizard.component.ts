import {Component, Input, ViewChild} from "@angular/core";
import {
   CustomDataExport,
   ExportScriptInputValue, ExportScriptJobSubmissionResult,
   ExportScriptPreview,
   ExportScriptValidateResult
} from "../../model/custom-export.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {View} from "../../model/view.model";
import {CustomDataImport} from "../../model/custom-import.model";
import {CustomImportPreviewComponentEvent} from "../import-data-component/custom-import-preview.component";
import {Observable} from "rxjs";
import {CustomExportListComponentEvent} from "./custom-export-list.component";
import {CustomExportInputFormComponentEvent} from "./custom-export-input-form.component";

export type CustomExportValidateFn = (v: View, c: CustomDataExport, i: ExportScriptInputValue[]) => Observable<ExportScriptValidateResult>;
export type CustomExportPreviewFn  = (v: View, c: CustomDataExport, i: ExportScriptInputValue[]) => Observable<ExportScriptPreview>;
export type CustomExportSubmitFn  =  (v: View, c: CustomDataExport, p: ExportScriptPreview, i: ExportScriptInputValue[]) => Observable<ExportScriptJobSubmissionResult>;

@Component({
   selector: 'app-custom-export-wizard',
   templateUrl: './custom-export-wizard.component.html',
   styleUrls: ['./custom-export-wizard.component.scss']
})
export class CustomExportWizardComponent {

   @Input() customDataExports: CustomDataExport[];
   @Input() customExportFormValidateFn: CustomExportValidateFn;
   @Input() customExportPreviewFn: CustomExportPreviewFn
   @Input() customExportSubmitFn: CustomExportSubmitFn;

   step1Ready: boolean;
   firstStepFormGroup: FormGroup;
   formControlCustomDataExport: FormControl;

   step2Ready: boolean;
   secondStepFormGroup: FormGroup;
   formControlView: FormControl;

   step3Ready: boolean;
   thirdStepFormGroup: FormGroup;
   formControlCustomExportInputValues: FormControl;

   step4Ready: boolean;
   fourthStepFormGroup: FormGroup;
   formControlCustomExportPreview: FormControl;

   step5Ready: boolean;
   fifthStepFormGroup: FormGroup;

   @ViewChild('stepper') stepper: MatStepper;

   constructor(private formBuilder: FormBuilder) {

      // first step
      this.step1Ready = true;
      this.formControlCustomDataExport = formBuilder.control('', [Validators.required]);
      this.firstStepFormGroup = formBuilder.group({
         'customDataExport': this.formControlCustomDataExport
      });

      // second step
      this.step2Ready = false;
      this.formControlView = formBuilder.control('', [Validators.required]);
      this.secondStepFormGroup = formBuilder.group({
         'view': this.formControlView
      });

      // third step
      this.step3Ready = false;
      this.formControlCustomExportInputValues = formBuilder.control('', [Validators.required]);
      this.thirdStepFormGroup = formBuilder.group({
         'customImportExportValues':  this.formControlCustomExportInputValues
      });

      // fourth step
      this.step4Ready = false;
      this.formControlCustomExportPreview = formBuilder.control('', [Validators.required]);
      this.fourthStepFormGroup = formBuilder.group({
         'preview': this.formControlCustomExportPreview
      });

      // fifth step
      this.step5Ready = false;
      this.fifthStepFormGroup = formBuilder.group({});
   }

   onCustomExportListEvent($event: CustomExportListComponentEvent) {
      this.formControlCustomDataExport.setValue($event.customDataExport);
   }

   onViewSelectorEvent($event: View) {
      this.formControlView.setValue($event);
   }

   onCustomExportFormEvent($event: CustomExportInputFormComponentEvent) {
      if ($event.validationResult.valid) {
         this.formControlCustomExportInputValues.setValue($event.inputValues);
      }
   }

   onStep1Submit() {
      console.log("**** on step1 submit");
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
      const d: CustomDataImport = this.formControlCustomDataExport.value;

      this.step1Ready = true;
      this.step2Ready = false;
      this.step3Ready = false;
      this.step4Ready = false;
      this.step5Ready = false;
      this.stepper.reset();

      this.formControlCustomDataExport.setValue(d); // restore to whatever it is before we go back to step 1
   }

   onCustomImportPreviewEvent($event: CustomImportPreviewComponentEvent) {
      this.formControlCustomExportPreview.setValue($event.preview);
   }
}