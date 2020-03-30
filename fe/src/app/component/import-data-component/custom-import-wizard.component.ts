import {Component, Input} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomDataImport} from "../../model/custom-import.model";

@Component({
    selector: 'app-custom-import-wizard',
    templateUrl: './custom-import-wizard.component.html',
    styleUrls: ['./custom-import-wizard.component.scss']
})
export class CustomImportWizardComponent {

    @Input() customDataImport: CustomDataImport;

    firstStepFormGroup: FormGroup;
    secondStepFormGroup: FormGroup;
    thirdStepFormGroup: FormGroup;


    constructor(private formBuilder: FormBuilder) {
        this.firstStepFormGroup = formBuilder.group({

        });
        this.secondStepFormGroup = formBuilder.group({

        });
        this.thirdStepFormGroup = formBuilder.group({

        });
    }
}
