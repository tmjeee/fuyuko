import {Component, OnDestroy, OnInit, Provider} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '@fuyuko-common/model/view.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {RuleService} from '../../service/rule-service/rule.service';
import {Rule} from '@fuyuko-common/model/rule.model';
import {RulesTableComponentEvent} from '../../component/rules-component/rules-table.component';
import {CounterService} from '../../service/counter-service/counter.service';
import {combineAll, finalize, flatMap, map, mergeMap, tap} from 'rxjs/operators';
import {combineLatest, of, Subscription} from 'rxjs';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {CustomRuleService} from '../../service/custom-rule-service/custom-rule.service';
import {CustomRule, CustomRuleForView} from '@fuyuko-common/model/custom-rule.model';
import {CustomRuleTableComponentEvent} from '../../component/rules-component/custom-rule-table.component';
import {LoadingService} from '../../service/loading-service/loading.service';
import {assertDefinedReturn} from '../../utils/common.util';


@Component({
  templateUrl: './view-rules.page.html',
  styleUrls: ['./view-rules.page.scss'],
  providers: [
    {provide: CounterService, useClass: CounterService} as Provider
  ]
})
export class ViewRulesPageComponent implements OnInit, OnDestroy {

    currentView?: View;
    attributes: Attribute[] = [];
    rules: Rule[] = [];
    customRules: CustomRule[] = [];
    customRulesForView: CustomRuleForView[] = [];

    subscription?: Subscription;

    viewReady = false;
    rulesReady = false;

    constructor(private viewService: ViewService,
                private router: Router,
                private attributeService: AttributeService,
                private notificationService: NotificationsService,
                private customRuleService: CustomRuleService,
                private ruleService: RuleService,
                private loadingService: LoadingService) {
    }


    ngOnInit(): void {
        this.viewReady = false;
        this.loadingService.startLoading();
        this.subscription = this.viewService
            .asObserver()
            .pipe(
                map((currentView: View | undefined) => {
                    if (currentView) {
                        this.currentView = currentView;
                        this.w();
                    }
                    this.viewReady = true;
                }),
                finalize(() => {
                    this.viewReady = true;
                    this.loadingService.stopLoading();
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private w() {
        this.rulesReady = false;
        if (this.currentView) {
            this.loadingService.startLoading();
            combineLatest([
                this.attributeService.getAllAttributesByView(this.currentView.id)
                    .pipe(map((r: PaginableApiResponse<Attribute[]>) => assertDefinedReturn(r.payload))),
                this.ruleService.getAllRulesByView(this.currentView.id),
                this.customRuleService.getAllCustomRules(),
                this.customRuleService.getCustomRulesByView(this.currentView.id),
            ]).pipe(
                map((r: [Attribute[], Rule[], CustomRule[], CustomRuleForView[]]) => {
                    this.attributes = r[0];
                    this.rules = r[1];
                    this.customRules = r[2];
                    this.customRulesForView = r[3];
                }),
                finalize(() => {
                    this.rulesReady = true;
                    this.loadingService.stopLoading();
                })
            ).subscribe();
        }
    }

    reload() {
        this.rulesReady = false;
        setTimeout(() => {
            this.w();
        });
    }

    async onRulesTableEvent($event: RulesTableComponentEvent) {
        switch ($event.type) {
            case 'add':
                await this.router.navigate(['/view-layout', {
                    outlets: {
                        primary: ['add-rule'],
                        help: ['view-help']
                    }
                }]);
                break;
            case 'edit':
                if ($event.rule) {
                    await this.router.navigate(['/view-layout', {
                        outlets: {
                            primary: ['edit-rule', `${$event.rule.id}`],
                            help: ['view-help']
                        }
                    }]);
                }
                break;
            case 'delete':
                if ($event.rule) {
                    if (this.currentView) {
                        this.ruleService.deleteRule(this.currentView.id, $event.rule)
                            .pipe(
                                map((r: ApiResponse) => {
                                    toNotifications(this.notificationService, r);
                                    this.reload();
                                })
                            ).subscribe();
                    }
                }
                break;
            case 'enable':
                if ($event.rule) {
                    if (this.currentView) {
                        this.ruleService.enableRule(this.currentView.id, $event.rule)
                            .pipe(
                                map((r: ApiResponse) => {
                                    toNotifications(this.notificationService, r);
                                    this.reload();
                                })
                            ).subscribe();
                    }
                }
                break;
            case 'disable':
                if ($event.rule && this.currentView) {
                    this.ruleService.disableRule(this.currentView.id, $event.rule)
                        .pipe(
                            map((r: ApiResponse) => {
                                toNotifications(this.notificationService, r);
                                this.reload();
                            })
                        ).subscribe();
                }
                break;
        }
    }

    onCustomRuleTableEvent($event: CustomRuleTableComponentEvent) {
        switch ($event.type) {
            case 'add': {
                if (this.currentView) {
                    const rules: CustomRule[] = $event.customRules ?? [];
                    let apiResponse: ApiResponse;
                    this.customRuleService.addCustomRuleToView(this.currentView.id, rules)
                        .pipe(
                            mergeMap((_: ApiResponse) => {
                                apiResponse = _;
                                return [this.customRuleService.getCustomRulesByView(
                                    assertDefinedReturn(this.currentView).id)];
                            }),
                            combineAll(),
                            tap((r: CustomRuleForView[][]) => {
                                this.customRulesForView = r[0];
                                toNotifications(this.notificationService, apiResponse);
                            })
                        ).subscribe();
                }
                break;
            }
            case 'delete': {
                if (this.currentView) {
                    const rules: CustomRuleForView[] = $event.customRulesForView ?? [];
                    let apiResponse: ApiResponse;
                    this.customRuleService.removeCustomRuleFromView(this.currentView.id, rules)
                        .pipe(
                            map((_: ApiResponse) => {
                                apiResponse = _;
                                return this.customRuleService.getCustomRulesByView(
                                    assertDefinedReturn(this.currentView).id);
                            }),
                            combineAll(),
                            tap((r: CustomRuleForView[][]) => {
                                this.customRulesForView = r[0];
                                toNotifications(this.notificationService, apiResponse);
                            })
                        ).subscribe();
                }
                break;
            }
            case 'enabled': {
                if (this.currentView) {
                    const rules: CustomRuleForView[] = $event.customRulesForView ?? [];
                    this.customRuleService.enableCustomRuleInView((this.currentView).id, rules)
                        .pipe(
                            map((_: ApiResponse[]) => {
                                return this.customRuleService.getCustomRulesByView(
                                    assertDefinedReturn(this.currentView).id);
                            }),
                            combineAll(),
                            tap((r: CustomRuleForView[][]) => {
                                this.customRulesForView = r[0];
                                this.notificationService.success('Enabled', `Custom rule(s) enabled`);
                            })
                        ).subscribe();
                }
                break;
            }
            case 'disabled': {
                if (this.currentView) {
                    const rules: CustomRuleForView[] = $event.customRulesForView ?? [];
                    this.customRuleService.disableCustomRuleInView(this.currentView.id, rules)
                        .pipe(
                            map((_) => {
                                return this.customRuleService.getCustomRulesByView(
                                    assertDefinedReturn(this.currentView).id);
                            }),
                            combineAll(),
                            tap((r: CustomRuleForView[][]) => {
                                this.customRulesForView = r[0];
                                this.notificationService.success('Deleted', `Custom rule(s) disabled`);
                            })
                        ).subscribe();
                }
                break;
            }
        }
    }
}
