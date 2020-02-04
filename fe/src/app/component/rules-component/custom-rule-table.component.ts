import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CustomRule, CustomRuleForView} from "../../model/custom-rule.model";

export interface CustomRuleTableComponentEvent {
    type: 'enabled' | 'disabled' | 'delete';
    customRule: CustomRuleForView;
}


@Component({
    selector: 'app-custom-rule-table',
    templateUrl: './custom-rule-table.component.html',
    styleUrls: ['./custom-rule-table.component.scss']
})
export class CustomRuleTableComponent implements OnInit {


    @Input() allCustomRules: CustomRule[];
    @Input() customRulesInView: CustomRuleForView[];
    @Output() events: EventEmitter<CustomRuleTableComponentEvent>;

    constructor() {
        this.events = new EventEmitter<CustomRuleTableComponentEvent>();
    }

    ngOnInit(): void {
    }

    onDeleteRule($event: MouseEvent, customRule: CustomRuleForView) {
        this.events.emit({
            type: 'disabled',
            customRule
        });
    }

    isDisabled(customRule: CustomRuleForView) {
        return customRule.status === 'DISABLED';
    }

    isEnabled(customRule: CustomRuleForView) {
        return customRule.status === 'ENABLED';
    }

    onEnableRule($event: MouseEvent, customRule: CustomRuleForView) {
        this.events.emit({
            type: 'enabled',
            customRule
        });
    }

    onDisableRule($event: MouseEvent, customRule: CustomRuleForView) {
        this.events.emit({
            type: 'disabled',
            customRule
        });
    }
}