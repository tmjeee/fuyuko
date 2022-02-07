import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CustomRule, CustomRuleForView} from '@fuyuko-common/model/custom-rule.model';
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
export class CustomRuleTableComponent implements OnInit, OnChanges {


    @Input() allCustomRules: CustomRule[] = [];
    @Input() customRulesInView: CustomRuleForView[] = [];
    @Output() events: EventEmitter<CustomRuleTableComponentEvent>;

    mainControlsHidden!: boolean;

    formGroupAllCustomRules!: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.events = new EventEmitter<CustomRuleTableComponentEvent>();
        this.formGroupAllCustomRules = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.mainControlsHidden = true;
        console.log('**** ngOnInit');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.allCustomRules) {
            for (const customRule of this.allCustomRules) {
                this.formGroupAllCustomRules.setControl(customRule.name, this.formBuilder.control(
                    this.customRulesInView.map((c: CustomRule) => c.name).includes(customRule.name)
                ));
            }
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
        this.mainControlsHidden = true;
    }

}
