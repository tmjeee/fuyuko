import {Item, Value} from './item.model';
import {Level} from './level.model';
import {Progress} from './progress.model';
import {Attribute} from './attribute.model';
import {RuleLevel} from "./rule.model";

export interface CustomValidationContext {
    log: (msg: string) => void;
    viewId: () => number;
    validationId: () => number;
    itemId: () => number;
    item: () => Item;
    attribute: (attributeId: number) => Attribute;
    reportError: (attributeId: number, message: string) => void;
}

export interface CreateValidation {
    id: number;
    viewId: number;
    name: string;
    description: string;
}

export interface Validation {
    id: number;
    viewId: number;
    name: string;
    description: string;
    progress: Progress;
    creationDate: Date;
    lastUpdate: Date;
}

export interface ValidationLogResult {
    progress: Progress;
    batchHasMoreBefore: boolean;
    batchHasMoreAfter: boolean;
    batchTotal: number;
    batchSize: number;
    batchFirstValidationLogId: number;
    batchLastValidationLogId: number;
    logs: ValidationLog[];
};

export interface ValidationResult {
    id: number;
    viewId: number;
    name: string;
    description: string;
    progress: Progress;
    creationDate: Date;
    lastUpdate: Date;
    logResult: ValidationLogResult;
    errors: ValidationError[];
}

export interface ValidationRule {
    id: number;
    name: string;
    description: string;
    errors: ValidationError[];
}

export interface ValidationLog {
    id: number;
    level: Level;
    creationDate: Date;
    message: string;
}

export interface ValidationError {
    id: number;
    ruleId: number;
    itemId: number;
    attributeId: number;
    message: string;
    level: RuleLevel;
}

