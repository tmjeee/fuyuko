import {Component, OnInit, Provider} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '../../model/view.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {Attribute} from '../../model/attribute.model';
import {RuleService} from '../../service/rule-service/rule.service';
import {ALL_OPERATOR_TYPES, OperatorType, Rule} from '../../model/rule.model';
import {RulesTableComponentEvent} from '../../component/rules-component/rules-table.component';
import {CounterService} from '../../service/counter-service/counter.service';
import {map} from 'rxjs/operators';
import {combineLatest} from 'rxjs';


@Component({
  templateUrl: './view-rules.page.html',
  styleUrls: ['./view-rules.page.scss'],
  providers: [
    {provide: CounterService, useClass: CounterService} as Provider
  ]
})
export class ViewRulesPageComponent implements OnInit {

  currentView: View;
  attributes: Attribute[];
  rules: Rule[];


  ready: boolean;

  constructor(private viewService: ViewService,
              private attributeService: AttributeService,
              private ruleService: RuleService) {
  }


  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.ready = false;
    this.viewService
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
                console.log('**** rules loaded', this.rules);
              })
            ).subscribe();
          }
        })
      ).subscribe();
  }

  onRulesTableEvent($event: RulesTableComponentEvent) {
    switch ($event.type) {
      case 'add':
        this.ruleService.addRule($event.rule)
          .pipe(
            map( (r: Rule) => {
              this.reload();
            })
          ).subscribe();
        break;
      case 'edit':
        this.ruleService.updateRule($event.rule)
          .pipe(
            map( (r: Rule) => {
              this.reload();
            })
          ).subscribe();
        break;
      case 'delete':
        this.ruleService.deleteRule($event.rule)
          .pipe(
            map((r: Rule) => {
              this.reload();
            })
          ).subscribe();
        break;
    }
  }
}
