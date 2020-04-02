import {View} from "./view.model";
import {Level} from "./level.model";
import {NewNotification} from "./notification.model";
import moment from "moment";
import {FileDataObject} from "./file.model";

// model of custom export from db
export interface CustomDataExport {
    id: number,
    name: string,
    description: string,
    creationDate: Date,
    lastUpdate: Date,
    inputs: ExportScriptInput[],
}


///// --- for executors

export class CustomExportContext {
    data: any;
}

export interface ExportScript {
    description(): string;
    inputs(): ExportScriptInput[];
    preview(view: View, inputValues: ExportScriptInputValue[], ctx: CustomExportContext): ExportScriptPreview;
    action(view: View, inputValues: ExportScriptInputValue[], preview: ExportScriptPreview, ctx: CustomExportContext, log: (leve: Level, msg: string) => void): CustomExportJob;
    /**
     * value would be
     * - type 'string' = 'string'
     * - type 'number' = 'number'
     * - type 'date' = moment
     * - type 'checkbox' = boolean
     * - type 'select' = 'string' (key of option)
     */
    validate(values: ExportScriptInputValue[]): ExportScriptValidateResult;
};

export type ExportScriptValidateResult = {valid: boolean, messages: NewNotification[]};
export type ExportScriptJobSubmissionResult = {valid: boolean, messages: NewNotification[]};

export interface ExportScriptPreview {
    proceed: boolean;
    messages?: NewNotification[];
    columns?: string[];
    rows?: {[column: string]: string}[];
};

export interface ExportScriptInput {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'file';
    name: string;
    description: string;
    options?: {key: string, value: string}[];   // only valid when type is select
};

export interface ExportScriptInputValue {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'file';
    name: string;
    value: string | number | moment.Moment | boolean | FileDataObject
}

export interface CustomExportJob {
    run: () => void;
}
