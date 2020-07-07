import {BulkEditItem, BulkEditPackage} from "../../model/bulk-edit.model";
import {Job} from "../../model/job.model";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {JobLogger, newJobLogger} from "../job-log.service";
import {Value} from "../../model/item.model";
import {ItemValue2} from "../../server-side-model/server-side.model";
import {itemValueRevert} from "../conversion-item-value.service";
import {updateItemValue2} from "../item.service";
import {convertToDebugString} from "../../shared-utils/ui-item-value-converters.util";
import {BulkEditJobEvent, fireEvent} from "../event/event.service";
const uuid = require('uuid');

/**
 *  ============================
 *  === runJob ===
 *  ============================
 */
export const runJob = async (viewId: number, bulkEditPackage: BulkEditPackage): Promise<Job> => {
    const uid = uuid();
    const jobLogger: JobLogger = await newJobLogger(`BulkEditJob-${uid}`, `Bulk Edit Job (${uid}) for viewId ${viewId}`);
    const job: Job = await doInDbConnection(async ({query}: Connection) => {
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
    
    fireEvent({
       type: 'BulkEditJobEvent',
       state: 'Scheduled',
       jobId: job.id 
    } as BulkEditJobEvent);

    // run asynchronusly
    run(jobLogger, viewId, bulkEditPackage);

    return job;
};

/**
 *  ============================
 *  === run ===
 *  ============================
 */
export const run = async (jobLogger: JobLogger, viewId: number, bulkEditPackage: BulkEditPackage) => {
    jobLogger.updateProgress('IN_PROGRESS');
    jobLogger.logInfo(`Start running bulk edit job (jobId: ${jobLogger.jobId})`);
    try {
        await doInDbConnection(async (conn: Connection) => {
            await u(conn, jobLogger, viewId, bulkEditPackage.bulkEditItems);
        });
        jobLogger.logInfo(`Done running bulk edit job (jobId: ${jobLogger.jobId})`);
        jobLogger.updateProgress('COMPLETED');

        fireEvent({
            type: 'BulkEditJobEvent',
            state: 'Completed',
            jobId: jobLogger.jobId
        } as BulkEditJobEvent);
    } catch (e) {
        jobLogger.updateProgress('FAILED');
        jobLogger.logError(`Encounter error ${e}`);

        fireEvent({
            type: 'BulkEditJobEvent',
            state: 'Failed',
            jobId: jobLogger.jobId
        } as BulkEditJobEvent);
    }
}

// ===== helper functions ===========
const u = async (conn: Connection, jobLogger: JobLogger, viewId: number, bulkEditItems: BulkEditItem[]) => {
    for (const bulkEditItem of bulkEditItems) {
        jobLogger.logInfo(`Working on item ${bulkEditItem.id}`);
        const itemId: number = bulkEditItem.id;
        const vs: Value[] = Object.values(bulkEditItem.changes).map((_ => _.new));

        for (const v of vs) {
            const itemValue: ItemValue2 = itemValueRevert(v);
            await updateItemValue2(viewId, itemId, itemValue);
            jobLogger.logInfo(`Changed attribute ${v.attributeId} value for item ${itemId} to ${convertToDebugString(v.val)}`)
        }

        const children: BulkEditItem[] = bulkEditItem.children;
        await u(conn, jobLogger, viewId, children);
    }
}
