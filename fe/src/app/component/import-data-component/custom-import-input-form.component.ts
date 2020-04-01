import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from "@angular/core";
import {
    CustomDataImport, FileDataObject,
    ImportScriptInput,
    ImportScriptInputValue,
    ImportScriptValidateResult
} from "../../model/custom-import.model";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {CustomImportValidateFn} from "./custom-import-wizard.component";
import {tap} from "rxjs/operators";
import {fromFileToFileDataObject} from "../../shared-utils/buffer.util";
const binary = require('bops');


export interface CustomImportInputFormComponentEvent {
    inputValues: ImportScriptInputValue[];
    validationResult: ImportScriptValidateResult;
};

@Component({
   selector: 'app-custom-import-input-form',
   templateUrl: './custom-import-input-form.component.html' ,
   styleUrls: ['./custom-import-input-form.component.scss']
})
export class CustomImportInputFormComponent implements OnInit, OnChanges{

   @Input() customDataImport: CustomDataImport;
   @Input() validateFn: CustomImportValidateFn;

   @Output() events: EventEmitter<CustomImportInputFormComponentEvent>;

   validationResult: ImportScriptValidateResult;

   formGroup: FormGroup;

   constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({});
      this.events = new EventEmitter<CustomImportInputFormComponentEvent>()
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
                console.log('***8 add control to group');
                this.formGroup.addControl(i.name, this.formBuilder.control(''));
             });
          }
       }
   }


   onSubmit() {
       console.log('*** form submit', this.formGroup);
       const iv: ImportScriptInputValue[] = this.toImportScriptInputValue();
       if (this.validateFn) {
           this.validateFn(this.customDataImport, iv).pipe(
               tap((r: ImportScriptValidateResult) => {
                   console.log('**************** validation result', r);
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
      const fileList: FileList = ($event.target as HTMLInputElement).files;
      const file: File = fileList[0];

      const fileDataObject: FileDataObject = await fromFileToFileDataObject(file);
      this.formGroup.controls[input.name].setValue(fileDataObject);
      console.log('****************** bops', fileDataObject);

       /*
        (file as any).arrayBuffer().then((a) => {
            const dataString = JSON.stringify(Array.from(new Uint8Array(a)));
            const fileDataObject: FileDataObject = {
                name: file.name,
                size: file.size,
                type: file.type,
                data: dataString
            };
            this.formGroup.controls[input.name].setValue(fileDataObject);
            console.log('****************** bops', fileDataObject);
        });
        */
   }
}