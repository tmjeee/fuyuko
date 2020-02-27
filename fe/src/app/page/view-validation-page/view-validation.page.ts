import {Component, OnDestroy, OnInit} from '@angular/core';
import {ValidationService} from '../../service/validation-service/validation.service';
import {ViewService} from '../../service/view-service/view.service';
import {Subscription, throwError} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {Validation} from '../../model/validation.model';
import {NotificationsService} from 'angular2-notifications';
import {ValidationRunComponentEvent} from '../../component/validation-result-component/validation-run.component';
import {ValidationResultListingComponentEvent} from '../../component/validation-result-component/validation-result-listing.component';

@Component({
    templateUrl: './view-validation.page.html',
    styleUrls: ['./view-validation.page.scss']
})
export class ViewValidationPageComponent implements OnInit, OnDestroy {

    view: View; // current active view
    validations: Validation[];
    subscription: Subscription;

    loading: boolean;

    constructor(private viewService: ViewService,
                private notificationsService: NotificationsService,
                private validationService: ValidationService) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.subscription = this.viewService.asObserver()
            .pipe(
                tap((v: View) => {
                    this.view = v;
                    if (v) {
                        this._reload();
                    }
                }),
                catchError((e: Error) => {
                    return throwError(e);
                }),
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onValidationRun($event: ValidationRunComponentEvent) {
        if ($event) {
            this.validationService
                .scheduleValidation(this.view.id, $event.name, $event.description)
                .pipe(
                    tap((r: {ok: boolean, validationId: number}) => {
                        this.notificationsService.success(`Validation schduled`, `Validation with id ${r.validationId} is scheduled`);
                    })
                ).subscribe()
            ;
        }
    }

    reload($event: MouseEvent) {
        this._reload();
    }

    _reload() {
        if (this.view) {
            this.loading = true;
            this.validationService.getAllValidations(this.view.id).pipe(
                tap((vals: Validation[]) => {
                    this.validations = vals;
                }),
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe();
        }
    }

    onValidationResultListingEvents($event: ValidationResultListingComponentEvent) {
        switch ($event.type) {
            case 'delete':
                this.validationService
                    .deleteValidation($event.validation.viewId, $event.validation.id)
                    .pipe(
                        tap((_) => {
                            this.notificationsService.success(`Success`, `Validation deleted`);
                            this._reload();
                        })
                    ).subscribe();
                break;
        }
    }
}
