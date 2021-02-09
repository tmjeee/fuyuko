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


    i(`Workflow definitions scripts sync, files to db`);
    for (const workflowFile of sortedWorkflowFilesInWorkflowsDir) {
        const fullWorkflowFilePath: string = path.join(workflowsDirPath, workflowFile);
        const workflowScript: WorkflowScript = await import(fullWorkflowFilePath);
        if (!workflowScript) {
           continue;
        }
        const c: number = await doInDbConnection(async (conn: Connection) => {
           const q1: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_WORKFLOW_DEFINITION WHERE NAME = ?
           `, [workflowFile]);
           return q1[0].COUNT;
        });
        if (c <= 0) { // file not already in db
            await doInDbConnection(async (conn: Connection) => {
                await conn.query(`INSERT INTO TBL_WORKFLOW_DEFINITION (NAME, DESCRIPTION) VALUES (?,?)`,
                    [workflowFile, workflowScript.description ? workflowScript.description : `${workflowFile} description`]);
            });
            i(`Create workflow definition file ${workflowFile} entry in db`)
        } else { // file already in db
            i(`Workflow definition file ${workflowFile} entry already in db`);
        }
    }

    i(`Workflow definition script reverse sync, db to files`);
    await doInDbConnection(async (conn: Connection) => {
        const q1: QueryA = await conn.query(`SELECT ID, NAME FROM TBL_WORKFLOW_DEFINITION`);
        for (const qi of q1) {
            const scriptName: string = qi.NAME; // this is the name in TBL_WORKFLOW
            const workflowDefinitionId: number = qi.ID;
            if (!sortedWorkflowFilesInWorkflowsDir.includes(scriptName)) { // db entry do not have respective workflow definition file version
                i(`Workflow Definition db entry ${scriptName} do not have corresponding workflow definition file, removing it from db`);
                await conn.query(`DELETE FROM TBL_WORKFLOW_DEFINITION WHERE ID=?`, [workflowDefinitionId]);
            } else {
                i(`Workflow Definition db entry ${scriptName} have a corresponding workflow definition file (in sync), no action required`);
            }
        }
    });
};