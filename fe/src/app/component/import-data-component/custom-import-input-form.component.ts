import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from "@angular/core";
import {
   CustomDataImport,
   ImportScriptInput,
   ImportScriptInputValue,
   ImportScriptValidateResult
} from "../../model/custom-import.model";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";


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
   @Input() validateFn: (values: ImportScriptInputValue[]) => ImportScriptValidateResult;

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
           this.validationResult = this.validateFn(iv);
           this.events.emit({
               inputValues: iv,
               validationResult: this.validationResult
           });
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

   onFileUpload($event: Event, input: ImportScriptInput) {
      const fileList: FileList = ($event.target as HTMLInputElement).files;
      const file: File = fileList[0];
      this.formGroup.controls[input.name].setValue(file);
   }
}