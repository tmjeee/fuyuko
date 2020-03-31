import {Level} from "./level.model";
import moment from 'moment';
import {NewNotification} from "./notification.model";


export interface CustomDataImport {
    id: number,
    name: string,
    description: string,
    creationDate: Date,
    lastUpdate: Date,
    inputs: ImportScriptInput[],
}


///// --- for executors

export class CustomImportContext {
    data: any;
}

export interface ImportScript {
    description(): string;
    inputs(): ImportScriptInput[];
    preview(inputValues: ImportScriptInputValue[], ctx: CustomImportContext): ImportScriptPreview;
    action(inputValues: ImportScriptInputValue[], preview: ImportScriptPreview, ctx: CustomImportContext, log: (level: Level, msg: string) => void): CustomImportJob;
    /**
     * value would be
     * - type 'string' = 'string'
     * - type 'number' = 'number'
     * - type 'date' = moment
     * - type 'checkbox' = boolean
     * - type 'select' = 'string' (key of option)
     */
    validate(values: ImportScriptInputValue[]): ImportScriptValidateResult;
};

export type ImportScriptValidateResult = {valid: boolean, messages: NewNotification[]};
export type ImportScriptJobSubmissionResult = {valid: boolean, messages: NewNotification[]};

export interface ImportScriptPreview {
    proceed: boolean;
    messages?: NewNotification[];
    columns?: string[];
    rows?: {[column: string]: string}[];
};

export interface ImportScriptInput {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'file';
    name: string;
    description: string;
    options?: {key: string, value: string}[];   // only valid when type is select
};

export interface ImportScriptInputValue {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'file';
    name: string;
    value: string | number | moment.Moment | boolean
}

export interface CustomImportJob {
    run: () => void;
}