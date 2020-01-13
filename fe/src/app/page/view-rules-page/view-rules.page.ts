import {Component, OnDestroy, OnInit, Provider} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '../../model/view.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {Attribute} from '../../model/attribute.model';
import {RuleService} from '../../service/rule-service/rule.service';
import {Rule} from '../../model/rule.model';
import {OperatorType, ALL_OPERATOR_TYPES} from '../../model/operator.model';
import {RulesTableComponentEvent} from '../../component/rules-component/rules-table.component';
import {CounterService} from '../../service/counter-service/counter.service';
import {combineAll, concatMap, finalize, map} from 'rxjs/operators';
import {combineLatest, of, Subscription} from 'rxjs';
import {ApiResponse} from "../../model/response.model";
import {toNotifications} from "../../service/common.service";
import {NotificationsService} from "angular2-notifications";


@Component({
  templateUrl: './view-rules.page.html',
  styleUrls: ['./view-rules.page.scss'],
  providers: [
    {provide: CounterService, useClass: CounterService} as Provider
  ]
})
export class ViewRulesPageComponent implements OnInit, OnDestroy {

  currentView: View;
  attributes: Attribute[];
  rules: Rule[];

  subscription: Subscription;


  ready: boolean;

  constructor(private viewService: ViewService,
              private attributeService: AttributeService,
              private notificationService: NotificationsService,
              private ruleService: RuleService) {
  }


  ngOnInit(): void {
    this.subscription = this.viewService
      .asObserver()
      .pipe(
        map((currentView: View) => {
          if (currentView) {
              this.currentView = currentView;
              combineLatest([
                  this.attributeService.getAllAttributesByView(this.currentView.id),
                  this.ruleService.getAllRulesByView(this.currentView.id)
              ]).pipe(
                  map((r: [Attribute[], Rule[]]) => {
                      this.attributes = r[0];
                      this.rules = r[1];
                      this.ready = true;
                  })
              ).subscribe();
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
    console.log('************************** reload');
    this.ready = false;

    setTimeout(() => {
        combineLatest([
            this.attributeService.getAllAttributesByView(this.currentView.id),
            this.ruleService.getAllRulesByView(this.currentView.id)
        ]).pipe(
            map((r: [Attribute[], Rule[]]) => {
                this.attributes = r[0];
                this.rules = r[1];
                this.ready = true;
                console.log('***** rules', this.rules);
            })
        ).subscribe();
    });
  }

    onRulesTableEvent($event: RulesTableComponentEvent) {
        switch ($event.type) {
      case 'add':
        this.ruleService.addRule(this.currentView.id, $event.rule)
          .pipe(
            map( (r: ApiResponse) => {
              toNotifications(this.notificationService, r);
              this.reload();
            })
          ).subscribe();
        break;
      case 'edit':
        this.ruleService.updateRule(this.currentView.id, $event.rule)
          .pipe(
            map( (r: ApiResponse) => {
              toNotifications(this.notificationService, r);
              this.reload();
            })
          ).subscribe();
        break;
      case 'delete':
        this.ruleService.deleteRule(this.currentView.id, $event.rule)
          .pipe(
            map((r: ApiResponse) => {
              toNotifications(this.notificationService, r);
              this.reload();
            })
          ).subscribe();
        break;
        case 'enable':
            this.ruleService.enableRule(this.currentView.id, $event.rule)
                .pipe(
                    map((r: ApiResponse) => {
                        toNotifications(this.notificationService, r);
                        this.reload();
                    })
                ).subscribe();
            break;
        case 'disable':
            this.ruleService.disableRule(this.currentView.id, $event.rule)
                .pipe(
                    map((r: ApiResponse) => {
                        toNotifications(this.notificationService, r);
                        this.reload();
                    })
                ).subscribe();
            break;
    }
  }
}
