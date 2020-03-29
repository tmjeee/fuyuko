import {Status} from './status.model';
import {CustomValidationContext} from "./validation.model";

export interface RuleScript {
    description: () => string;
    run: (context: CustomValidationContext) => void;
}

export interface CustomRule {
    id: number;
    name: string;
    description: string;
}

export interface CustomRuleForView {
    id: number;
    name: string;
    description: string;
    status: Status;
    customRuleViewId: number; // TBL_CUSTOM_RULE_VIEW's ID
    viewId: number; // TBL_VIEW's ID ie. view's ID
}

