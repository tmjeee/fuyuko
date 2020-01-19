import {Value} from './item.model';
import {Level} from './level.model';
import {Progress} from './progress.model';


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

export interface ValidationResult {
    id: number;
    viewId: number;
    name: string;
    description: string;
    progress: Progress;
    creationDate: Date;
    lastUpdate: Date;
    logs: ValidationLog[];
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
    itemId: number;
    attributeId: number;
    message: string;
}

