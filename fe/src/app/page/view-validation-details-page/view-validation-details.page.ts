import {Component, OnDestroy, OnInit} from '@angular/core';
import {View} from '../../model/view.model';
import {Item} from '../../model/item.model';
import {Attribute} from '../../model/attribute.model';
import {Rule} from '../../model/rule.model';
import {ValidationError, ValidationResult} from '../../model/validation.model';
import {forkJoin, Subscription, throwError} from 'rxjs';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ItemService} from '../../service/item-service/item.service';
import {ValidationService} from '../../service/validation-service/validation.service';
import {RuleService} from '../../service/rule-service/rule.service';
import {ViewService} from '../../service/view-service/view.service';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {ValidationResultTableComponentEvent} from '../../component/validation-result-component/validation-result-table.component';
import {ApiResponse, PaginableApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    templateUrl: './view-validation-details.page.html',
    styleUrls: ['./view-validation-details.page.scss']
})
export class ViewValidationDetailsPageComponent implements OnInit, OnDestroy {

    view: View;
    items: Item[];
    attributes: Attribute[];
    rules: Rule[];
    validationResult: ValidationResult;

    subscription: Subscription;
    viewId: string;
    validationId: string;
    loading: boolean;

    constructor(private attributeService: AttributeService,
                private itemService: ItemService,
                private notificationService: NotificationsService,
                private validationService: ValidationService,
                private ruleService: RuleService,
                private viewService: ViewService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload() {
        this.loading = true;
        this.items = [];
        this.viewId = this.route.snapshot.params.viewId;
        this.validationId = this.route.snapshot.params.validationId;
        this.viewService.getViewById(this.viewId).pipe(
            tap((v: View) => {
                this.view = v;
                forkJoin({
                    attributes: this.attributeService.getAllAttributesByView(this.view.id)
                        .pipe(map((r: PaginableApiResponse<Attribute[]>) => r.payload)),
                    rules: this.ruleService.getAllRulesByView(this.view.id),
                    validationResult: this.validationService.getValidationDetails(this.view.id, Number(this.validationId)),
                }).pipe(
                    tap((r: {attributes: Attribute[], rules: Rule[], validationResult: ValidationResult}) => {
                        this.attributes = r.attributes;
                        this.rules = r.rules;
                        this.validationResult = r.validationResult;
                        const itemIds: number[] = r.validationResult.errors.map((e: ValidationError) => e.itemId);
                        this.itemService.getItemsByIds(this.view.id, itemIds)
                            .pipe(
                                map((r: PaginableApiResponse<Item[]>) => r.payload),
                                tap((i: Item[]) => {
                                    this.items = i;
                                }),
                                finalize(() => {
                                    this.loading = false;
                                })
                            ).subscribe();
                    }),
                    catchError((e: Error) => {
                        this.loading = false;
                        return throwError(e);
                    })
                ).subscribe();
            })
        ).subscribe();
    }

    onValidationResultEvent($event: ValidationResultTableComponentEvent) {
        switch ($event.type) {
            case 'modification':
                forkJoin([
                    this.itemService.saveTableItems(this.view.id, $event.modifiedItems)
                ]).pipe(
                    tap((r: [ApiResponse]) => {
                        toNotifications(this.notificationService, r[0]);
                        this.reload();
                    })
                ).subscribe();
                break;
            case 'reload':
                this.reload();
                break;
        }
    }
}
