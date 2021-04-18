import {
    CustomBulkEdit,
    CustomBulkEditContext, CustomBulkEditJob,
    CustomBulkEditScript,
    CustomBulkEditScriptInputValue,
    CustomBulkEditScriptJobSubmissionResult,
    CustomBulkEditScriptPreview,
    CustomBulkEditScriptValidateResult
} from '@fuyuko-common/model/custom-bulk-edit.model';
import * as path from "path";
import {View} from '@fuyuko-common/model/view.model';
import {getViewById} from "../service/view.service";
import {LoggingCallback, newJobLogger, newLoggingCallback} from "../service/job-log.service";
import {i} from "../logger";
import * as util from "util";
import * as fs from "fs";
import * as semver from "semver";
import {doInDbConnection, QueryA, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {v4 as uuid} from 'uuid';
import {getCustomBulkEditById} from "../service/custom-bulk-edit.service";

const createCustomBulkEditContext = (): CustomBulkEditContext => {
    return {data: {}} as CustomBulkEditContext;
};

export const getCustomBulkEditScriptByName = async (customBulkEditScriptName: string): Promise<CustomBulkEditScript> => {
    const customBulkEditFilePath = path.join(__dirname, 'custom-bulk-edit-scripts', customBulkEditScriptName);
    const s: CustomBulkEditScript = await import(customBulkEditFilePath);
    return s;
};

export const validate = async (viewId: number, customBulkEditId: number, inputValues: CustomBulkEditScriptInputValue[]): Promise<CustomBulkEditScriptValidateResult> => {
    const customBulkEdit: CustomBulkEdit = await getCustomBulkEditById(customBulkEditId);
    if (customBulkEdit == null) {
        return {
            valid: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find custom bulk edit with id ${customBulkEditId}`}]
        };
    }
    const view: View = await getViewById(viewId);
    if (view == null) {
        return {
            valid: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find view with id ${viewId}`}]
        };
    }
    const customBulkEditName = customBulkEdit.name;
    const s: CustomBulkEditScript = await getCustomBulkEditScriptByName(customBulkEditName);
    if (s.validate) {
        const r: CustomBulkEditScriptValidateResult = s.validate(view, inputValues);
        return r;
    } else {
        return {
            valid: true,
            messages: []
        }  as CustomBulkEditScriptValidateResult
    }
};


export const preview = async (viewId: number, customBulkEditId: number, inputValues: CustomBulkEditScriptInputValue[]): Promise<CustomBulkEditScriptPreview> => {
    const customBulkEdit: CustomBulkEdit = await getCustomBulkEditById(customBulkEditId);
    if (customBulkEdit == null) {
        return {
            proceed: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find custom bulk edit with id ${customBulkEditId}`}],
            columns: [],
            rows: []
        };
    }
    const view: View = await getViewById(viewId);
    if (view == null) {
        return {
            proceed: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find view with id ${viewId}`}],
            columns: [],
            rows: []
        };
    }

    const customBulkEditName: string = customBulkEdit.name;
    const s: CustomBulkEditScript = await getCustomBulkEditScriptByName(customBulkEditName);

    if (s.preview) {
        const ctx: CustomBulkEditContext = createCustomBulkEditContext();
        const preview: CustomBulkEditScriptPreview = s.preview(view, inputValues, ctx);
        return preview;
    } else {
        const p: CustomBulkEditScriptPreview = {
            proceed: false,
            messages: [
                { status: 'ERROR', title: 'Error', message: `Missing preview implementation in custom bulk edit script ${customBulkEditName}`}
            ],
            columns: [],
            rows: []
        }
        return p;
    }
};


export const runCustomBulkEditJob = async (viewId: number, customBulkEditId: number, inputValues: CustomBulkEditScriptInputValue[], preview: CustomBulkEditScriptPreview): Promise<CustomBulkEditScriptJobSubmissionResult> => {
    const customBulkEdit: CustomBulkEdit = await getCustomBulkEditById(customBulkEditId);
    if (!customBulkEdit) {
        return {
            valid: false,
            messages: [{status: 'ERROR', title: `Error`, message: `Custom bulk edit with id ${customBulkEditId} is not found`}]
        } as CustomBulkEditScriptJobSubmissionResult;
    }
    const view: View = await getViewById(viewId);
    if (view == null) {
        return {
            valid: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find view with id ${viewId}`}],
        };
    }
    const s: CustomBulkEditScript = await getCustomBulkEditScriptByName(customBulkEdit.name);

    const jobName = `${customBulkEdit.name}-${uuid()}`;
    const logging: LoggingCallback = newLoggingCallback(await newJobLogger(jobName, `${jobName} description`));

    const ctx: CustomBulkEditContext = createCustomBulkEditContext();
    const job: CustomBulkEditJob  = s.action(view, inputValues, preview, ctx, logging);


    new Promise((res, rej) => {
        try {
            job.run();
            res(true);
        } catch(e) {
            rej(e);
        }
    });

    return {
        valid: true,
        messages: [{status: 'INFO', title: `Success`, message: `Custom bulk edit job ${jobName} submitted`}]
    } as CustomBulkEditScriptJobSubmissionResult;
};


export const runCustomBulkEditSync = async () => {

    i(`Running custom bulk edit script sync ...`);

    const customBulkEditScriptsDirPath: string = path.join(__dirname, 'custom-bulk-edit-scripts');
    const customBulkEditScriptsFilesInDir: string[] = await util.promisify(fs.readdir)(customBulkEditScriptsDirPath);
    const sortedCustomBulkEditScriptFilesInDir: string[] = customBulkEditScriptsFilesInDir
        .filter((f: string) => f.endsWith('js'))
        .sort((f1: string, f2: string) => semver.compare(f1, f2));

    i(`Custom bulk edit scripts forward sync, files to db`);
    for (const customBulkEditScriptFile of sortedCustomBulkEditScriptFilesInDir) {
        const fullCustomBulkEditScriptFilePath = path.join(__dirname, 'custom-bulk-edit-scripts', customBulkEditScriptFile);
        const s: CustomBulkEditScript = await import(fullCustomBulkEditScriptFilePath);
        if (!s) {
            continue;
        }

        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            return await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_CUSTOM_BULK_EDIT WHERE NAME = ? `, [customBulkEditScriptFile]);
        });
        if (q[0].COUNT <= 0) { // script does not exists yet, add it
            await doInDbConnection(async (conn: Connection) => {
                const q: QueryResponse = await conn.query(`INSERT INTO TBL_CUSTOM_BULK_EDIT (NAME, DESCRIPTION) VALUES (?, ?)`, [
                    customBulkEditScriptFile, s.description() ? s.description() : '']);
            });
            i(`Created db entry for custom bulk edit script ${customBulkEditScriptFile}`);
        } else {
            i(`Custom bulk edit script file ${customBulkEditScriptFile} already registered before`);
        }



        i(`Custom bulk edit script reverse sync, db to files`);
        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION FROM TBL_CUSTOM_BULK_EDIT`);
            for (const qi of q) {
                const name = qi.NAME;
                if (!sortedCustomBulkEditScriptFilesInDir.includes(name)) { // does not have a script for it, probably old, needs removing
                    i(`Db custom bulk edit registry ${name} is outdated, custom bulk edit script do not exists anymore, removing it from registry`);
                    await conn.query(`DELETE FROM TBL_CUSTOM_BULK_EDIT WHERE ID = ?`, [qi.ID]);
                } else {
                    i(`Db custom bulk edit registry ${name} is in sync with custom bulk edit script, no action required`);
                }
            }
        });

        i(`Done custom bulk edit script sync`);
    }
}
