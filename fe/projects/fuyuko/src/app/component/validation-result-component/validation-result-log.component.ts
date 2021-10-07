import {Component, Input} from '@angular/core';
import {ValidationLogResult, ValidationResult} from '@fuyuko-common/model/validation.model';
import {sprintf} from 'sprintf';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export interface ValidationResultLogComponentEvent {
    type: 'show-more' | 'show-previous';
    validationLogId: number;
    viewId: number;
    validationId: number;
    order: 'before' | 'after';
    limit: number;
}

export type ValidationResultLogReloadFn = (event: ValidationResultLogComponentEvent) => Observable<ValidationLogResult>;

@Component({
    selector: 'app-validation-result-log',
    templateUrl: './validation-result-log.component.html',
    styleUrls: ['./validation-result-log.component.scss']
})
export class ValidationResultLogComponent {

    @Input() validationResult!: ValidationResult;
    @Input() validationResultLogReloadFn?: ValidationResultLogReloadFn;

    printf(message: any, width: any): string {
        return sprintf(`%s${width}`, message);
    }

    showPrevious($event: MouseEvent) {
        console.log('******** show previous', this.validationResultLogReloadFn);
        if (this.validationResultLogReloadFn && this.validationResult && this.validationResult.logResult) {
            this.validationResultLogReloadFn({
                type: 'show-previous',
                validationLogId: this.validationResult.logResult.batchFirstValidationLogId,
                viewId: this.validationResult.viewId,
                validationId: this.validationResult.id,
                order: 'before',
                limit: this.validationResult.logResult.batchSize
            } as ValidationResultLogComponentEvent).pipe(
                tap((r: ValidationLogResult) => {
                    if (this.validationResult.logResult) {
                        this.validationResult.logResult.batchHasMoreBefore = r.batchHasMoreBefore;
                        this.validationResult.logResult.batchTotal = r.batchTotal;
                        this.validationResult.logResult.batchSize = r.batchSize;
                        this.validationResult.logResult.batchFirstValidationLogId = r.batchFirstValidationLogId;
                        this.validationResult.logResult.progress = r.progress;
                        this.validationResult.logResult.logs.unshift(...r.logs);
                    }
                })
            ).subscribe();
        }
    }

    showMore($event: MouseEvent) {
        console.log('******** show more', this.validationResultLogReloadFn);
        if (this.validationResultLogReloadFn && this.validationResult && this.validationResult.logResult) {
            this.validationResultLogReloadFn({
                type: 'show-more',
                validationLogId: this.validationResult.logResult.batchLastValidationLogId,
                viewId: this.validationResult.viewId,
                validationId: this.validationResult.id,
                order: 'after',
                limit: this.validationResult.logResult.batchSize
            } as ValidationResultLogComponentEvent).pipe(
                tap((r: ValidationLogResult) => {
                    if (this.validationResult.logResult) {
                        this.validationResult.logResult.batchHasMoreAfter = r.batchHasMoreAfter;
                        this.validationResult.logResult.batchTotal = r.batchTotal;
                        this.validationResult.logResult.batchSize = r.batchSize;
                        this.validationResult.logResult.batchLastValidationLogId = r.batchLastValidationLogId;
                        this.validationResult.logResult.progress = r.progress;
                        this.validationResult.logResult.logs.push(...r.logs);
                    }
                })
            ).subscribe();
        }
    }
}
