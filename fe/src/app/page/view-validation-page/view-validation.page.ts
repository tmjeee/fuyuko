import {Component, OnDestroy, OnInit} from '@angular/core';
import {ValidationService} from '../../service/validation-service/validation.service';
import {ViewService} from '../../service/view-service/view.service';
import {Subscription, throwError} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {Validation} from '../../model/validation.model';

@Component({
    templateUrl: './view-validation.page.html',
    styleUrls: ['./view-validation.page.scss']
})
export class ViewValidationPageComponent implements OnInit, OnDestroy {

    view: View;
    validations: Validation[];
    subscription: Subscription;

    loading: boolean;

    constructor(private viewService: ViewService,
                private validationService: ValidationService) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.subscription = this.viewService.asObserver()
            .pipe(
                tap((v: View) => {
                    this.view = v;
                    if (v) {
                        this.validationService.getAllValidations(v.id).pipe(
                            tap((vals: Validation[]) => {
                                this.validations = vals;
                            }),
                            finalize(() => {
                                this.loading = false;
                            })
                        ).subscribe();
                    }
                }),
                catchError((e: Error) => {
                    this.loading = false;
                    return throwError(e);
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


}
