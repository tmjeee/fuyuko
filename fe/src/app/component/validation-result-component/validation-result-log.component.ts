import {Component, Input} from '@angular/core';
import {ValidationResult} from '../../model/validation.model';
import {sprintf} from 'sprintf';

@Component({
    selector: 'app-validation-result-log',
    templateUrl: './validation-result-log.component.html',
    styleUrls: ['./validation-result-log.component.scss']
})
export class ValidationResultLogComponent {

    @Input() validationResult: ValidationResult;

    printf(message: any, width): string {
        return sprintf(`%s${width}`, message);
    }
}
