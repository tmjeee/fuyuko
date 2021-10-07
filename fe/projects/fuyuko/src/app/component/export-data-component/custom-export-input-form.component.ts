import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {tap} from 'rxjs/operators';
import {FileDataObject} from '@fuyuko-common/model/file.model';
import {fromFileToFileDataObject} from '@fuyuko-common/shared-utils/buffer.util';
import {CustomImportInputFormComponentEvent} from '../import-data-component/custom-import-input-form.component';
import {
    CustomDataExport,
    ExportScriptInput,
    ExportScriptInputValue,
    ExportScriptValidateResult
} from '@fuyuko-common/model/custom-export.model';
import {CustomExportValidateFn} from './custom-export-wizard.component';
import {View} from '@fuyuko-common/model/view.model';

export interface CustomExportInputFormComponentEvent {
    inputValues: ExportScriptInputValue[];
    validationResult: ExportScriptValidateResult;
}

@Component({
    selector: 'app-custom-export-input-form',
    templateUrl: './custom-export-input-form.component.html',
    styleUrls: ['./custom-export-input-form.component.scss']
})
export class CustomExportInputFormComponent implements OnInit, OnChanges {

    @Input() customDataExport!: CustomDataExport;
    @Input() validateFn!: CustomExportValidateFn;
    @Input() view!: View;

    @Output() events: EventEmitter<CustomExportInputFormComponentEvent>;

    validationResult?: ExportScriptValidateResult;

    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.formGroup = this.formBuilder.group({});
        this.events = new EventEmitter<CustomImportInputFormComponentEvent>();
    }

    formControl(k: string): FormControl {
        return this.formGroup.controls[k] as FormControl;
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const simpleChange: SimpleChange = changes.customDataExport;
        if (simpleChange && simpleChange.currentValue) {
            const customDataImport: CustomDataExport  = simpleChange.currentValue;
            const inputs: ExportScriptInput[] = customDataImport.inputs;
            if (inputs) {
                inputs.forEach((i: ExportScriptInput) => {
                    this.formGroup.addControl(i.name, this.formBuilder.control(''));
                });
            }
        }
    }


    onSubmit() {
        const iv: ExportScriptInputValue[] = this.toImportScriptInputValue();
        if (this.validateFn) {
            this.validateFn(this.view, this.customDataExport, iv).pipe(
                tap((r: ExportScriptValidateResult) => {
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

    toImportScriptInputValue(): ExportScriptInputValue[] {
        const r: ExportScriptInputValue[] = this.customDataExport.inputs.map((i: ExportScriptInput) => {
            return {
                name: i.name,
                type: i.type,
                value:  this.formGroup.controls[i.name].value
            } as ExportScriptInputValue;
        });
        return r;
    }

    async onFileUpload($event: Event, input: ExportScriptInput) {
        const fileList: FileList | null = ($event.target as HTMLInputElement).files;
        const file: File | undefined = (fileList && fileList.length) ? fileList[0] : undefined;

        if (file) {
            const fileDataObject: FileDataObject = await fromFileToFileDataObject(file);
            this.formGroup.controls[input.name].setValue(fileDataObject);
        }
    }

}
