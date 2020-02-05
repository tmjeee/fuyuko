import {Status} from './status.model';

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
    customRuleViewId: number;
    viewId: number;
}

