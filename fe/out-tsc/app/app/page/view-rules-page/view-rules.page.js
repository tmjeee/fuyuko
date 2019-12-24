import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ViewService } from '../../service/view-service/view.service';
import { AttributeService } from '../../service/attribute-service/attribute.service';
import { RuleService } from '../../service/rule-service/rule.service';
import { CounterService } from '../../service/counter-service/counter.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { toNotifications } from "../../service/common.service";
import { NotificationsService } from "angular2-notifications";
let ViewRulesPageComponent = class ViewRulesPageComponent {
    constructor(viewService, attributeService, notificationService, ruleService) {
        this.viewService = viewService;
        this.attributeService = attributeService;
        this.notificationService = notificationService;
        this.ruleService = ruleService;
    }
    ngOnInit() {
        this.subscription = this.viewService
            .asObserver()
            .pipe(map((currentView) => {
            if (currentView) {
                this.currentView = currentView;
                combineLatest([
                    this.attributeService.getAllAttributesByView(this.currentView.id),
                    this.ruleService.getAllRulesByView(this.currentView.id)
                ]).pipe(map((r) => {
                    this.attributes = r[0];
                    this.rules = r[1];
                    this.ready = true;
                })).subscribe();
            }
            else {
                this.ready = true;
            }
        })).subscribe();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    reload() {
        this.ready = false;
        combineLatest([
            this.attributeService.getAllAttributesByView(this.currentView.id),
            this.ruleService.getAllRulesByView(this.currentView.id)
        ]).pipe(map((r) => {
            this.attributes = r[0];
            this.rules = r[1];
            this.ready = true;
        })).subscribe();
    }
    onRulesTableEvent($event) {
        switch ($event.type) {
            case 'add':
                this.ruleService.addRule(this.currentView.id, $event.rule)
                    .pipe(map((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                })).subscribe();
                break;
            case 'edit':
                this.ruleService.updateRule(this.currentView.id, $event.rule)
                    .pipe(map((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                })).subscribe();
                break;
            case 'delete':
                this.ruleService.deleteRule(this.currentView.id, $event.rule)
                    .pipe(map((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                })).subscribe();
                break;
            case 'enable':
                this.ruleService.enableRule(this.currentView.id, $event.rule)
                    .pipe(map((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                })).subscribe();
                break;
            case 'disable':
                this.ruleService.disableRule(this.currentView.id, $event.rule)
                    .pipe(map((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                })).subscribe();
                break;
        }
    }
};
ViewRulesPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './view-rules.page.html',
        styleUrls: ['./view-rules.page.scss'],
        providers: [
            { provide: CounterService, useClass: CounterService }
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [ViewService,
        AttributeService,
        NotificationsService,
        RuleService])
], ViewRulesPageComponent);
export { ViewRulesPageComponent };
//# sourceMappingURL=view-rules.page.js.map