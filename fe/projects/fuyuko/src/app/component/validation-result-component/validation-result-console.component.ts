import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Item} from '@fuyuko-common/model/item.model';
import {ValidationError, ValidationResult} from '@fuyuko-common/model/validation.model';
import {Observable, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';


@Component({
    selector: 'app-validation-result-console',
    templateUrl: './validation-result-console.component.html',
    styleUrls: ['./validation-result-console.component.scss']
})
export class ValidationResultConsoleComponent implements OnInit, OnDestroy {

    @Input() validationResult!: ValidationResult;
    @Input() itemObservable!: Observable<Item | undefined>;
    @Input() validationErrorObservable!: Observable<ValidationError[]>;

    itemObservableSubscription?: Subscription;
    validationErrorObservableSubscription?: Subscription;

    currentItem?: Item;
    currentValidationErrors: ValidationError[] = [];

    ngOnInit(): void {
        if (this.itemObservable) {
            this.itemObservableSubscription = this.itemObservable.pipe(
               tap((i: Item | undefined) => {
                   this.currentItem = i;
               })
            ).subscribe();
        }
        if (this.validationErrorObservable) {
            this.validationErrorObservableSubscription = this.validationErrorObservable.pipe(
                tap((v: ValidationError[]) => {
                    this.currentValidationErrors = v;
                })
            ).subscribe();
        }
    }

    ngOnDestroy(): void {
        if (this.itemObservableSubscription) {
            this.itemObservableSubscription.unsubscribe();
        }
        if (this.validationErrorObservableSubscription) {
            this.validationErrorObservableSubscription.unsubscribe();
        }
    }

}
