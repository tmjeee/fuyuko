import {Level} from "./level.model";
import moment from 'moment';


export interface CustomDataImport {
    id: number,
    name: string,
    description: string,
    creationDate: Date,
    lastUpdate: Date,
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
};

export interface ImportScriptPreview {
    proceed: boolean;
    messages?: {level: Level, title: string, message: string}[];
    columns?: string[];
    rows?: {[column: string]: string}[];
};

export interface ImportScriptInput {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select';
    name: string;
    description: string;
    /**
     * value would be
     * - type 'string' = 'string'
     * - type 'number' = 'number'
     * - type 'date' = moment
     * - type 'checkbox' = boolean
     * - type 'select' = 'string' (key of option)
     */
    validators?: ((value: any)=>boolean)[];
    options?: {key: string, value: string}[];   // only valid when type is select
};

export interface ImportScriptInputValue {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select';
    name: string;
    value: string | number | moment.Moment | boolean
}

export interface CustomImportJob {
    run: () => void;
}