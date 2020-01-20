import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Item} from '../../model/item.model';
import {Validation, ValidationResult} from '../../model/validation.model';
import {Rule} from '../../model/rule.model';


@Component({
    selector: 'app-validation-result-console',
    templateUrl: './validation-result-console.component.html',
    styleUrls: ['./validation-result-console.component.scss']
})
export class ValidationResultConsoleComponent implements OnChanges {

    @Input() item: Item;
    @Input() validationResult: ValidationResult;
    @Input() rule: Rule;

    ngOnChanges(changes: SimpleChanges): void {
    }

}
