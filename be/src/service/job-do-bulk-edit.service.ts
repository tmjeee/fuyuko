import {BulkEditItem, BulkEditPackage} from "../model/bulk-edit.model";
import {Job} from "../model/job.model";
import {doInDbConnection, QueryA} from "../db";
import {Pool, PoolConnection} from "mariadb";
import {JobLogger, newJobLogger} from "./job-log.service";
import {Value} from "../model/item.model";
import {ItemValue2} from "../route/model/server-side.model";
import {revert} from "./conversion-item-value.service";
import {updateItemValue} from "./item.service";
const uuid = require('uuid');


export const scheduleBulkEditJob = async (viewId: number, bulkEditPackage: BulkEditPackage): Promise<Job> => {
    const uid = uuid();
    const jobLogger: JobLogger = await newJobLogger(`BulkEditJob-${uid}`, `Bulk Edit Job (${uid}) for viewId ${viewId}`);
    const job: Job = await doInDbConnection(async ({query}: PoolConnection) => {
        const q: QueryA = await query(`
            SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE, STATUS, PROGRESS FROM TBL_JOB WHERE ID=?
        `, [jobLogger.jobId]);

        return {
          id:  q[0].ID,
          name: q[0].NAME,
          description: q[0].DESCRIPTOIN,
          creationDate: q[0].CREATION_DATE,
          lastUpdate: q[0].LAST_UPDATE,
          status: q[0].STATUS,
          progress: q[0].PROGRESS
        } as Job;
    });

    // run asynchronusly
    run(jobLogger, viewId, bulkEditPackage);

    return job;
};

const run = async (jobLogger: JobLogger, viewId: number, bulkEditPackage: BulkEditPackage) => {
    jobLogger.updateProgress('IN_PROGRESS');
    jobLogger.logInfo(`Start running bulk edit job (jobId: ${jobLogger.jobId})`);
    try {
        await doInDbConnection(async (conn: PoolConnection) => {
            await u(conn, jobLogger, viewId, bulkEditPackage.bulkEditItems);
        });
        jobLogger.logInfo(`Done running bulk edit job (jobId: ${jobLogger.jobId})`);
        jobLogger.updateProgress('COMPLETED');
    } catch (e) {
        jobLogger.updateProgress('FAILED');
        jobLogger.logError(`Encounter error ${e}`);
    }
}


const u = async (conn: PoolConnection, jobLogger: JobLogger, viewId: number, bulkEditItems: BulkEditItem[]) => {
    for (const bulkEditItem of bulkEditItems) {
        jobLogger.logInfo(`Working on item ${bulkEditItem.id}`);
        const itemId: number = bulkEditItem.id;
        const vs: Value[] = Object.values(bulkEditItem.changes).map((_ => _.new));

        for (const v of vs) {
            const itemValue: ItemValue2 = revert(v);
            await updateItemValue(viewId, itemId, itemValue);
            jobLogger.logInfo(`Changed attribute ${v.attributeId} for item ${itemId} to ${v.val}`)
        }

        const children: BulkEditItem[] = bulkEditItem.children;
        await u(conn, jobLogger, viewId, children);
    }
}
