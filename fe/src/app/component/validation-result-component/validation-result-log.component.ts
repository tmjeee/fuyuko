import {Component, Input} from '@angular/core';
import {ValidationResult} from '../../model/validation.model';

@Component({
    selector: 'app-validation-result-log',
    templateUrl: './validation-result-log.component.html',
    styleUrls: ['./validation-result-log.component.scss']
})
export class ValidationResultLogComponent {

    @Input() validationResult: ValidationResult;

}
