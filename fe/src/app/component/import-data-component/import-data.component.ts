import {Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {View} from "../../model/view.model";

@Component({
    selector: 'app-import-data',
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {

    firstFormGroup: FormGroup;
    viewFormControl: FormControl;

    secondFormGroup: FormGroup;
    fileUploadConfig: any;

    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;

    @Input() views: View[];

    constructor(private formBuilder: FormBuilder) {
        this.viewFormControl = formBuilder.control('', [Validators.required]);
        this.firstFormGroup = formBuilder.group({
            view: this.viewFormControl
        });
        this.secondFormGroup = formBuilder.group({});
        this.thirdFormGroup = formBuilder.group({});
        this.fourthFormGroup = formBuilder.group({});

        };
        fileUploadConfig: any = {
            multiple: false,
            fomatsAllowed: '.csv',
            maxSize: 20,
            uploadAPI: {
                url: '',
                headers: {
                }
            },
        };
    }
}

