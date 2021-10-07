import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {
    CustomDataImport,
    ImportScriptInput,
    ImportScriptInputValue,
    ImportScriptValidateResult
} from '@fuyuko-common/model/custom-import.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CustomImportValidateFn} from './custom-import-wizard.component';
import {tap} from 'rxjs/operators';
import {fromFileToFileDataObject} from '@fuyuko-common/shared-utils/buffer.util';
import {FileDataObject} from '@fuyuko-common/model/file.model';
import {View} from '@fuyuko-common/model/view.model';


export interface CustomImportInputFormComponentEvent {
    inputValues: ImportScriptInputValue[];
    validationResult: ImportScriptValidateResult;
}

@Component({
   selector: 'app-custom-import-input-form',
   templateUrl: './custom-import-input-form.component.html' ,
   styleUrls: ['./custom-import-input-form.component.scss']
})
export class CustomImportInputFormComponent implements OnInit, OnChanges{

   @Input() customDataImport!: CustomDataImport;
   @Input() validateFn!: CustomImportValidateFn;
   @Input() view!: View;

   @Output() events: EventEmitter<CustomImportInputFormComponentEvent>;

   validationResult?: ImportScriptValidateResult;

   formGroup: FormGroup;

   constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({});
      this.events = new EventEmitter<CustomImportInputFormComponentEvent>();
   }

   ngOnInit(): void {
   }

   ngOnChanges(changes: SimpleChanges): void {
       const simpleChange: SimpleChange = changes.customDataImport;
       if (simpleChange && simpleChange.currentValue) {
          const customDataImport: CustomDataImport  = simpleChange.currentValue;
          const inputs: ImportScriptInput[] = customDataImport.inputs;
          if (inputs) {
             inputs.forEach((i: ImportScriptInput) => {
                this.formGroup.addControl(i.name, this.formBuilder.control(''));
             });
          }
       }
   }

   formControl(key: string): FormControl {
       return this.formGroup.controls[key] as FormControl;
   }

   onSubmit() {
       const iv: ImportScriptInputValue[] = this.toImportScriptInputValue();
       if (this.validateFn) {
           this.validateFn(this.view, this.customDataImport, iv).pipe(
               tap((r: ImportScriptValidateResult) => {
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

   toImportScriptInputValue(): ImportScriptInputValue[] {
       const r: ImportScriptInputValue[] = this.customDataImport.inputs.map((i: ImportScriptInput) => {
          return {
            name: i.name,
            type: i.type,
            value:  this.formGroup.controls[i.name].value
          } as ImportScriptInputValue;
       });
       return r;
   }

   async onFileUpload($event: Event, input: ImportScriptInput) {
      const fileList: FileList | null = ($event.target as HTMLInputElement).files;
      const file: File | undefined = fileList && fileList.length ? fileList[0] : undefined;

      if (file) {
          const fileDataObject: FileDataObject = await fromFileToFileDataObject(file);
          this.formGroup.controls[input.name].setValue(fileDataObject);
      }
   }
}
