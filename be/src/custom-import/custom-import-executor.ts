import {i} from "../logger";
import * as path from "path";
import * as util from "util";
import * as fs from "fs";
import * as semver from "semver";
import {doInDbConnection, QueryA, QueryResponse} from "../db";
import { Connection } from "mariadb";
import {
    CustomDataImport,
    CustomImportContext,
    CustomImportJob,
    ImportScript,
    ImportScriptInputValue, ImportScriptPreview
} from "../model/custom-import.model";
import {JobLogger, LoggingCallback, newJobLogger, newLoggingCallback} from "../service/job-log.service";
import uuid = require("uuid");
import {Level} from "../model/level.model";

const createCustomImportContext = () => {
    return {data: {}} as CustomImportContext;
}

export const preview = async (customDataImport: CustomDataImport, ctx: CustomImportContext, inputValues: ImportScriptInputValue[]) => {
    const customDataImportFilePath = path.join(__dirname, 'custom-import', customDataImport.name);

    const s: ImportScript = await import(customDataImportFilePath);

    const preview: ImportScriptPreview = s.preview(inputValues, ctx);

    return preview;
}

export const runCustomImport = async (customDataImport: CustomDataImport, ctx: CustomImportContext, inputValues: ImportScriptInputValue[], preview: ImportScriptPreview) => {

    const customDataImportFilePath = path.join(__dirname, 'custom-import', customDataImport.name);

    const s: ImportScript = await import(customDataImportFilePath);

    const loggerName = `${customDataImport.name}-${uuid()}`;

    const logging: LoggingCallback = newLoggingCallback(await newJobLogger(loggerName, `${loggerName} description`));

    const job: CustomImportJob  = s.action(inputValues, preview, ctx, logging);

    new Promise((res, rej) => {
        job.run();
        res();
    });
};


export const runCustomImportSync = async () => {

    i(`Running custom import script sync ...`);

    const customImportScriptsDirPath: string = path.join(__dirname, 'custom-import-scripts');
    const customImportScriptsFilesInDir: string[] = await util.promisify(fs.readdir)(customImportScriptsDirPath);
    const sortedCustomImportScriptFilesInDir: string[] = customImportScriptsFilesInDir
        .filter((f: string) => f.endsWith('js'))
        .sort((f1: string, f2: string) => semver.compare(f1, f2));

    i(`Custom import scripts forward sync, files to db`);
    for (const customImportScriptFile of sortedCustomImportScriptFilesInDir) {
        const fullCustomImportScriptFilePath = path.join(__dirname, 'custom-import-scripts', customImportScriptFile);
        const s: ImportScript = await import(fullCustomImportScriptFilePath);
        if (!s) {
            continue;
        }

        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            return await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_CUSTOM_DATA_IMPORT WHERE NAME = ? `, [customImportScriptFile]);
        });
        if (q[0].COUNT <= 0) { // script does not exists yet, add it
            await doInDbConnection(async (conn: Connection) => {
                const q: QueryResponse = await conn.query(`INSERT INTO TBL_CUSTOM_DATA_IMPORT (NAME, DESCRIPTION) VALUES (?, ?)`, [
                    customImportScriptFile, s.description() ? s.description() : '']);
            });
            i(`Created db entry for custom import script ${customImportScriptFile}`);
        } else {
            i(`Custom import script file ${customImportScriptFile} already registered before`);
        }



        i(`Custom import script reverse sync, db to files`);
        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION FROM TBL_CUSTOM_DATA_IMPORT`);
            for (const qi of q) {
                const name = qi.NAME;
                if (!sortedCustomImportScriptFilesInDir.includes(name)) { // does not have a script for it, probably old, needs removing
                    i(`Db custom import registry ${name} is outdated, custom import script do not exists anymore, removing it from registry`);
                    await conn.query(`DELETE FROM TBL_CUSTOM_DATA_IMPORT WHERE ID = ?`, [qi.ID]);
                } else {
                    i(`Db custom import registry ${name} is in sync with custom import script, no action required`);
                }
            }
        });


        i(`Done custom import script sync`);
    }
}
