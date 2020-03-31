import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomDataImport, ImportScriptInputValue, ImportScriptValidateResult} from "../../model/custom-import.model";
import {CustomImportService} from "../../service/custom-import-service/custom-import.service";
import {tap} from "rxjs/operators";
import {CustomImportListComponentEvent} from "./custom-import-list.component";
import {View} from "../../model/view.model";
import {CustomImportInputFormComponentEvent} from "./custom-import-input-form.component";

@Component({
    selector: 'app-custom-import-wizard',
    templateUrl: './custom-import-wizard.component.html',
    styleUrls: ['./custom-import-wizard.component.scss']
})
export class CustomImportWizardComponent implements OnInit {

    @Input() customDataImports: CustomDataImport[];

    firstStepFormGroup: FormGroup;
    formControlCustomDataImport: FormControl;

    secondStepFormGroup: FormGroup;
    formControlView: FormControl;

    thirdStepFormGroup: FormGroup;
    formControlCustomImportInputValues: FormControl;

    fourthStepFormGroup: FormGroup;
    fifthStepFormGroup: FormGroup;
    customInputFormValidateFn: (i: ImportScriptInputValue) => ImportScriptValidateResult;

    constructor(private formBuilder: FormBuilder) {

        // first step
        this.formControlCustomDataImport = formBuilder.control('', [Validators.required]);
        this.firstStepFormGroup = formBuilder.group({
            'customDataImport': this.formControlCustomDataImport
        });

        // second step
        this.formControlView = formBuilder.control('', [Validators.required]);
        this.secondStepFormGroup = formBuilder.group({
            'view': this.formControlView
        });

        // third step
        this.formControlCustomImportInputValues = formBuilder.control('', [Validators.required]);
        this.thirdStepFormGroup = formBuilder.group({
            'customImportInputValues':  this.formControlCustomImportInputValues
        });

        // fourth step
        this.fourthStepFormGroup = formBuilder.group({

        });

        // fifth step
        this.fifthStepFormGroup = formBuilder.group({

        });
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
}
