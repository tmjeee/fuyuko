import {i} from "../logger";
import * as path from "path";
import * as util from "util";
import * as fs from "fs";
import * as semver from "semver";
import {doInDbConnection, QueryA, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {
    CustomDataExport,
    CustomExportContext, CustomExportJob,
    ExportScript,
    ExportScriptInputValue, ExportScriptJobSubmissionResult, ExportScriptPreview,
    ExportScriptValidateResult
} from "../model/custom-export.model";
import {getCustomExportById} from "../service/custom-export.service";
import {View} from "../model/view.model";
import {getViewById} from "../service/view.service";
import {LoggingCallback, newJobLogger, newLoggingCallback} from "../service/job-log.service";
import uuid = require("uuid");

const createCustomExportContext = (): CustomExportContext => {
    return {data: {}} as CustomExportContext;
};


export const getExportScriptByName = async (customExportScriptName: string): Promise<ExportScript> => {
    const customDataExportFilePath = path.join(__dirname, 'custom-export-scripts', customExportScriptName);
    const s: ExportScript = await import(customDataExportFilePath);
    return s;
};


export const validate = async (customDataExportId: number, inputValues: ExportScriptInputValue[]): Promise<ExportScriptValidateResult> => {
    const customDataExport: CustomDataExport = await getCustomExportById(customDataExportId);
    if (customDataExport == null) {
        return {
            valid: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find custom data export with id ${customDataExportId}`}]
        };
    }
    const customExportName = customDataExport.name;
    const s: ExportScript = await getExportScriptByName(customExportName);
    if (s.validate) {
        const r: ExportScriptValidateResult = s.validate(inputValues);
        return r;
    } else {
        return {
            valid: true,
            messages: []
        }  as ExportScriptValidateResult
    }
};


export const preview = async (viewId: number, customDataExportId: number, inputValues: ExportScriptInputValue[]): Promise<ExportScriptPreview> => {
    const customDataExport: CustomDataExport = await getCustomExportById(customDataExportId);
    if (customDataExport == null) {
        return {
            proceed: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find custom data export with id ${customDataExportId}`}],
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

    const customDataExportName: string = customDataExport.name;
    const s: ExportScript = await getExportScriptByName(customDataExport.name);

    if (s.preview) {
        const ctx: CustomExportContext = createCustomExportContext();
        const preview: ExportScriptPreview = s.preview(view, inputValues, ctx);
        return preview;
    } else {
        const p: ExportScriptPreview = {
            proceed: false,
            messages: [
                { status: 'ERROR', title: 'Error', message: `Missing preview implementation in export script ${customDataExportName}`}
            ],
            columns: [],
            rows: []
        }
        return p;
    }
};


export const runCustomExportJob = async (viewId: number, customDataExportId: number, inputValues: ExportScriptInputValue[], preview: ExportScriptPreview): Promise<ExportScriptJobSubmissionResult> => {
    const customDataExport: CustomDataExport = await getCustomExportById(customDataExportId);
    if (!customDataExport) {
        return {
            valid: false,
            messages: [{status: 'ERROR', title: `Error`, message: `Custom data export with id ${customDataExportId} is not found`}]
        } as ExportScriptJobSubmissionResult;
    }
    const view: View = await getViewById(viewId);
    if (view == null) {
        return {
            valid: false,
            messages: [{status: 'ERROR', title: 'Error', message: `Unable to find view with id ${viewId}`}],
        };
    }
    const s: ExportScript = await getExportScriptByName(customDataExport.name);

    const jobName = `${customDataExport.name}-${uuid()}`;
    const logging: LoggingCallback = newLoggingCallback(await newJobLogger(jobName, `${jobName} description`));

    const ctx: CustomExportContext = createCustomExportContext();
    const job: CustomExportJob  = s.action(view, inputValues, preview, ctx, logging);


    new Promise((res, rej) => {
        try {
            job.run();
            res();
        } catch(e) {
            rej(e);
        }
    });

    return {
        valid: true,
        messages: [{status: 'INFO', title: `Success`, message: `Custom export job ${jobName} submitted`}]
    } as ExportScriptJobSubmissionResult;
};


export const runCustomExportSync = async () => {

    i(`Running custom export script sync ...`);

    const customExportScriptsDirPath: string = path.join(__dirname, 'custom-export-scripts');
    const customExportScriptsFilesInDir: string[] = await util.promisify(fs.readdir)(customExportScriptsDirPath);
    const sortedCustomExportScriptFilesInDir: string[] = customExportScriptsFilesInDir
        .filter((f: string) => f.endsWith('js'))
        .sort((f1: string, f2: string) => semver.compare(f1, f2));

    i(`Custom export scripts forward sync, files to db`);
    for (const customExportScriptFile of sortedCustomExportScriptFilesInDir) {
        const fullCustomExportScriptFilePath = path.join(__dirname, 'custom-export-scripts', customExportScriptFile);
        const s: ExportScript = await import(fullCustomExportScriptFilePath);
        if (!s) {
            continue;
        }

        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            return await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_CUSTOM_DATA_EXPORT WHERE NAME = ? `, [customExportScriptFile]);
        });
        if (q[0].COUNT <= 0) { // script does not exists yet, add it
            await doInDbConnection(async (conn: Connection) => {
                const q: QueryResponse = await conn.query(`INSERT INTO TBL_CUSTOM_DATA_EXPORT (NAME, DESCRIPTION) VALUES (?, ?)`, [
                    customExportScriptFile, s.description() ? s.description() : '']);
            });
            i(`Created db entry for custom export script ${customExportScriptFile}`);
        } else {
            i(`Custom export script file ${customExportScriptFile} already registered before`);
        }



        i(`Custom export script reverse sync, db to files`);
        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION FROM TBL_CUSTOM_DATA_EXPORT`);
            for (const qi of q) {
                const name = qi.NAME;
                if (!sortedCustomExportScriptFilesInDir.includes(name)) { // does not have a script for it, probably old, needs removing
                    i(`Db custom export registry ${name} is outdated, custom export script do not exists anymore, removing it from registry`);
                    await conn.query(`DELETE FROM TBL_CUSTOM_DATA_EXPORT WHERE ID = ?`, [qi.ID]);
                } else {
                    i(`Db custom export registry ${name} is in sync with custom export script, no action required`);
                }
            }
        });

        i(`Done custom export script sync`);
    }
}