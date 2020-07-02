import {Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges} from "@angular/core";
import {View} from "../../model/view.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {tap} from "rxjs/operators";
import {FileDataObject} from "../../model/file.model";
import {fromFileToFileDataObject} from "../../shared-utils/buffer.util";
import {CustomBulkEditFormValidateFn} from "./custom-bulk-edit-wizard.component";
import {
   CustomBulkEdit, CustomBulkEditScriptInput,
   CustomBulkEditScriptInputValue,
   CustomBulkEditScriptValidateResult
} from "../../model/custom-bulk-edit.model";
import {CustomImportInputFormComponentEvent} from "../import-data-component/custom-import-input-form.component";


export interface CustomBulkEditInputFormComponentEvent {
   inputValues: CustomBulkEditScriptInputValue[];
   validationResult: CustomBulkEditScriptValidateResult;
};

@Component({
   selector: 'app-custom-bulk-edit-input-form',
   templateUrl: './custom-bulk-edit-input-form.component.html',
   styleUrls: ['./custom-bulk-edit-input-form.component.scss']
})
export class CustomBulkEditInputFormComponent {

   @Input() customBulkEdit: CustomBulkEdit;
   @Input() validateFn: CustomBulkEditFormValidateFn;
   @Input() view: View;

   @Output() events: EventEmitter<CustomBulkEditInputFormComponentEvent>;

   validationResult: CustomBulkEditScriptValidateResult;

   formGroup: FormGroup;

   constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({});
      this.events = new EventEmitter<CustomImportInputFormComponentEvent>()
   }

   ngOnInit(): void {
   }


   formControl(k: string): FormControl {
      return this.formGroup.controls[k] as FormControl;
   }

   ngOnChanges(changes: SimpleChanges): void {
      const simpleChange: SimpleChange = changes.customBulkEdit;
      if (simpleChange && simpleChange.currentValue) {
         const customBulkEdit: CustomBulkEdit  = simpleChange.currentValue;
         const inputs: CustomBulkEditScriptInput[] = customBulkEdit.inputs;
         if (inputs) {
            inputs.forEach((i: CustomBulkEditScriptInput) => {
               this.formGroup.addControl(i.name, this.formBuilder.control(''));
            });
         }
      }
   }


   onSubmit() {
      const iv: CustomBulkEditScriptInputValue[] = this.toImportScriptInputValue();
      if (this.validateFn) {
         this.validateFn(this.view, this.customBulkEdit, iv).pipe(
             tap((r: CustomBulkEditScriptValidateResult) => {
                 console.log('************** submit validation result', r);
                this.validationResult = r;
                this.events.emit({
                   inputValues: iv,
                   validationResult: this.validationResult
                });
             })
         ).subscribe();
      } else {
         this.validationResult = {
            valid: true,
            messages: []
         };
         this.events.emit({
            inputValues: iv,
            validationResult: this.validationResult
         });
      }
   }

   toImportScriptInputValue(): CustomBulkEditScriptInputValue[] {
      const r: CustomBulkEditScriptInputValue[] = this.customBulkEdit.inputs.map((i: CustomBulkEditScriptInput) => {
         return {
            name: i.name,
            type: i.type,
            value:  this.formGroup.controls[i.name].value
         } as CustomBulkEditScriptInputValue;
      });
      return r;
   }

   async onFileUpload($event: Event, input: CustomBulkEditScriptInput) {
      const fileList: FileList = ($event.target as HTMLInputElement).files;
      const file: File = fileList[0];

      const fileDataObject: FileDataObject = await fromFileToFileDataObject(file);
      this.formGroup.controls[input.name].setValue(fileDataObject);
   }

}