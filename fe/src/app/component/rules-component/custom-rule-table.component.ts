import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomRule, CustomRuleForView} from '../../model/custom-rule.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

export interface CustomRuleTableComponentEvent {
    type: 'enabled' | 'disabled' | 'delete' | 'add';
    customRulesForView?: CustomRuleForView[]; // for enabled, disabled and delete
    customRules?: CustomRule[]; // for add
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
    mainControlsHidden: boolean;

    formGroupAllCustomRules: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.events = new EventEmitter<CustomRuleTableComponentEvent>();
    }

    ngOnInit(): void {
        this.mainControlsHidden = true;
        this.formGroupAllCustomRules = this.formBuilder.group({});
        for (const customRule of this.allCustomRules) {
            this.formGroupAllCustomRules.setControl(customRule.name, this.formBuilder.control(false));
        }
    }

    formControl(customRule: CustomRule): FormControl {
        return this.formGroupAllCustomRules.controls[customRule.name] as FormControl;
    }

    onDeleteRule($event: MouseEvent, customRule: CustomRuleForView) {
        this.events.emit({
            type: 'delete',
            customRulesForView: [customRule]
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
            customRulesForView: [customRule]
        });
    }

    onDisableRule($event: MouseEvent, customRule: CustomRuleForView) {
        this.events.emit({
            type: 'disabled',
            customRulesForView: [customRule]
        });
    }

    toggleCustomRulePanel($event: MouseEvent) {
        this.mainControlsHidden = !this.mainControlsHidden;
    }

    onCustomRulesUpdateSubmit() {
        const checkedCustomRules: CustomRule[] =
            this.allCustomRules
                .filter((c: CustomRule) => this.formGroupAllCustomRules.controls[c.name].value);

        this.events.emit({
            type: 'add',
            customRules: checkedCustomRules
        });
    }
}
