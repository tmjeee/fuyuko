import {Component, OnDestroy, OnInit} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {NotificationsService} from 'angular2-notifications';
import {RuleService} from '../../service/rule-service/rule.service';
import {map, tap} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {combineLatest, Subscription} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {Rule} from '../../model/rule.model';
import {ActivatedRoute, Router} from '@angular/router';
import {RuleEditorComponentEvent} from '../../component/rules-component/rule-editor.component';

@Component({
    templateUrl: './edit-rule.page.html',
    styleUrls: ['./edit-rule.page.scss']
})
export class EditRulePageComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    currentView: View;
    attributes: Attribute[];
    rule: Rule;

    ready: boolean;

    constructor(private viewService: ViewService,
                private route: ActivatedRoute,
                private attributeService: AttributeService,
                private notificationService: NotificationsService,
                private router: Router,
                private ruleService: RuleService) {
    }

    ngOnInit(): void {
        this.ready = false;
        this.subscription = this.viewService
            .asObserver()
            .pipe(
                map((currentView: View) => {
                    if (currentView) {
                        this.currentView = currentView;
                        this.reload();
                        this.ready = true;
                    } else {
                        this.ready = true;
                    }
                }),
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload() {
        this.ready = false;
        const ruleId: string = this.route.snapshot.paramMap.get('ruleId');
        if (ruleId) {
            combineLatest([
                this.attributeService.getAllAttributesByView(this.currentView.id),
                this.ruleService.getRuleByView(this.currentView.id, Number(ruleId))
            ]).pipe(
                tap((r: [Attribute[], Rule]) => {
                    this.attributes = r[0];
                    this.rule = r[1];
                    this.ready = true;
                })
            ).subscribe();
        } else {
            combineLatest([
                this.attributeService.getAllAttributesByView(this.currentView.id),
            ]).pipe(
                tap((r: [Attribute[]]) => {
                    this.attributes = r[0];
                    this.rule = {
                        id: -1,
                        name: '',
                        status: null,
                        description: '',
                        validateClauses: [],
                        whenClauses: []
                    },
                    this.ready = true;
                })
            ).subscribe();
        }
    }

    async onRuleEditorEvent($event: RuleEditorComponentEvent) {
        switch ($event.type) {
            case 'cancel':
                await this.router.navigate(['/view-gen-layout', {outlets: {primary: ['rules'], help: ['view-help'] }}]);
                break;
            case 'update':
                if ($event.rule.id) { // existing
                    this.ruleService.updateRule(this.currentView.id, $event.rule)
                        .pipe(
                            tap((_) => {
                                this.notificationService.success(`Updated`, `Rule updated`);
                                this.reload();
                            })
                        ).subscribe();
                } else { // new
                    this.ruleService.addRule(this.currentView.id, $event.rule)
                        .pipe(
                            tap((_) => {
                                this.notificationService.success(`Added`, `Rule added`);
                                this.reload();
                            })
                        ).subscribe();
                }
                break;
        }
    }
}
