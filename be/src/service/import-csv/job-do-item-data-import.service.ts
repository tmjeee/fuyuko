import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger} from "../job-log.service";
import {getJobyById} from "../job.service";
import {Item} from "../../model/item.model";
import {addItem} from "../item.service";
import {revert} from "../conversion-item.service";
import {Item2} from "../../route/model/server-side.model";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";

const uuid = require('uuid');

export const runJob = async (viewId: number, attributeDataImportId: number, items: Item[]): Promise<Job> => {
    const uid = uuid();
    const name: string = `item-data-import-job-${uid}`;
    const description: string = `item-data-import-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);

    (async ()=> {
       await jobLogger.logInfo(`starting job ${name}`);
       const item2s: Item2[] = revert(items);
       await jobLogger.logInfo(`converted to Items2s`);
       try {
            const effectiveItem2s: Item2[] = [];
            for (const item2 of item2s) {
                await doInDbConnection(async (conn: Connection) => {
                    const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ITEM WHERE VIEW_ID=? AND NAME=?`, [viewId, item2.name]);
                    if (q.length > 0 && q[0].COUNT > 0) {
                       await jobLogger.logWarn(`Item with name ${item2.name} already exists in view ${viewId}, cannot be imported`);
                    } else {
                       effectiveItem2s.push(item2);
                    }
                });
            }

            for (const effectiveItem2 of effectiveItem2s) {
                await jobLogger.logInfo(`add item ${effectiveItem2.name} to view with id ${viewId}`);
                await addItem(viewId, effectiveItem2);
            }

            await jobLogger.updateProgress("COMPLETED");
            await jobLogger.logInfo(`mark ${name} as completed`);
       } catch(e) {
            await jobLogger.logError(`${e.toString()}`);
            await jobLogger.updateProgress('FAILED');
       } finally {
           await jobLogger.logInfo(`Done with ${name}`);
       }

    })();

    return await getJobyById(jobLogger.jobId);
}
