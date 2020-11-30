import {i} from "../logger";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import * as semver from 'semver';
import {doInDbConnection, QueryA} from "../db";
import {Connection} from "mariadb";
import {WorkflowScript} from "../server-side-model/server-side.model";


export const runCustomWorkflowSync = async () => {
    i(`Running workflow sync `);
    
    const workflowsDirPath: string = path.join(__dirname, 'workflows'); 
    const filesInWorkflowsDir: string[] = await util.promisify(fs.readdir)(workflowsDirPath);
    const sortedWorkflowFilesInWorkflowsDir: string[] = filesInWorkflowsDir
        .filter((f: string) => f.endsWith('.js'))
        .sort((f1: string, f2: string) => semver.compare(f1, f2))


    i(`Workflow scripts sync, files to db`);
    for (const workflowFile of sortedWorkflowFilesInWorkflowsDir) {
        const fullWorkflowFilePath: string = path.join(workflowsDirPath, workflowFile);
        const s: WorkflowScript = await import(fullWorkflowFilePath);
        if (!s) {
           continue;
        }
        const c: number = await doInDbConnection(async (conn: Connection) => {
           const q1: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_WORKFLOW WHERE NAME = ?
           `, [workflowFile]);
           return q1[0].COUNT;
        });
        if (c <= 0) { // file not already in db
            await doInDbConnection(async (conn: Connection) => {
                await conn.query(`INSERT INTO TBL_WORKFLOW (NAME, DESCRIPTION) VALUES (?,?)`,
                    [workflowFile, `${workflowFile} description`]);
            });
            i(`Create workflow file ${workflowFile} entry in db`)
        } else { // file already in db
            i(`Workflow file ${workflowFile} entry already in db`);
        }
    }

    i(`Workflow script reverse sync, db to files`);
    await doInDbConnection(async (conn: Connection) => {
        const q1: QueryA = await conn.query(`SELECT ID, NAME FROM TBL_WORKFLOW`);
        for (const qi of q1) {
            const scriptName: string = qi.NAME; // this is the name in TBL_WORKFLOW
            const workflowId: number = qi.ID;
            if (!sortedWorkflowFilesInWorkflowsDir.includes(scriptName)) { // db entry do not have respective workflow file version
                i(`Workflow db entry ${scriptName} do not have corresponding workflow file, removing it from db`);
                await conn.query(`DELETE FROM TBL_WORKFLOW WHERE ID=?`, [workflowId]);
            } else {
                i(`Workflow db entry ${scriptName} have a corresponding workflow file (in sync), no action required`);
            }
        }
    });
};