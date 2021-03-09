// model of custom bulk edit from db

import {View} from "./view.model";
import {Level} from "./level.model";
import {NewNotification} from "./notification.model";
import moment from 'moment';
import {FileDataObject} from "./file.model";

export interface CustomBulkEdit {
    id: number,
    name: string,
    description: string,
    creationDate: Date,
    lastUpdate: Date,
    inputs: CustomBulkEditScriptInput[],
}


///// --- for executors

export interface CustomBulkEditContext {
    data: any;
}
export interface CustomBulkEditScript {
    description(): string;
    inputs(): CustomBulkEditScriptInput[];
    preview(view: View, inputValues: CustomBulkEditScriptInputValue[], ctx: CustomBulkEditContext): CustomBulkEditScriptPreview;
    action(view: View, inputValues: CustomBulkEditScriptInputValue[], preview: CustomBulkEditScriptPreview, ctx: CustomBulkEditContext, log: (leve: Level, msg: string) => void): CustomBulkEditJob;
    /**
     * value would be
     * - type 'string' = 'string'
     * - type 'number' = 'number'
     * - type 'date' = moment
     * - type 'checkbox' = boolean
     * - type 'select' = 'string' (key of option)
     */
    validate(view: View, values: CustomBulkEditScriptInputValue[]): CustomBulkEditScriptValidateResult;
};

export type CustomBulkEditScriptValidateResult = {valid: boolean, messages: NewNotification[]};
export type CustomBulkEditScriptJobSubmissionResult = {valid: boolean, messages: NewNotification[]};

export interface CustomBulkEditScriptPreview {
    proceed: boolean;
    messages?: NewNotification[];
    columns?: string[];
    rows?: {[column: string]: string}[];
};

export interface CustomBulkEditScriptInput {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'file';
    name: string;
    description: string;
    options?: {key: string, value: string}[];   // only valid when type is select
};

export interface CustomBulkEditScriptInputValue {
    type: 'string' | 'number' | 'date' | 'checkbox' | 'select' | 'file';
    name: string;
    value: string | number | moment.Moment | boolean | FileDataObject
}

export interface CustomBulkEditJob {
    run: () => void;
}
