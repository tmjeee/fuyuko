import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger} from "../job-log.service";
import {getJobById} from "../job.service";
import {Item} from "../../model/item.model";
import {addItem, getItemByName} from "../item.service";
import {itemsRevert} from "../conversion-item.service";
import {Item2} from "../../server-side-model/server-side.model";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {addItemImage} from "../item-image.service";
import {fireEvent, ImportAttributeJobEvent, ImportItemJobEvent} from "../event/event.service";

const uuid = require('uuid');

/**
 * ================================
 * === runJob ===
 * ================================
 */
export const runJob = async (viewId: number, dataImportId: number, items: Item[]): Promise<Job> => {
    const uid = uuid();
    const name: string = `item-data-import-job-${uid}`;
    const description: string = `item-data-import-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);

    fireEvent({
        type: "ImportItemJobEvent",
        state: 'Scheduled',
        jobId: jobLogger.jobId
    } as ImportItemJobEvent);
    
    (async ()=> {
       await jobLogger.logInfo(`starting job ${name}`);
       // const item2s: Item2[] = itemsRevert(items);
       await jobLogger.logInfo(`converted to Items2s`);
       try {
            const effectiveItems: Item[] = [];
            for (const item of items) {
                await doInDbConnection(async (conn: Connection) => {
                    const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ITEM WHERE VIEW_ID=? AND NAME=?`, [viewId, item.name]);
                    if (q.length > 0 && q[0].COUNT > 0) {
                       await jobLogger.logWarn(`Item with name ${item.name} already exists in view ${viewId}, cannot be imported`);
                    } else {
                       effectiveItems.push(item);
                    }
                });
            }

            // issue #93: import zip with images
            for (const effectiveItem of effectiveItems) {
                await jobLogger.logInfo(`add item ${effectiveItem.name} to view with id ${viewId}`);
                const errors: string[] = await addItem(viewId, effectiveItem);
                for (const error of errors) {
                    await jobLogger.logError(`error from addItem service: ${error}`);
                }
                const i: Item = await getItemByName(viewId, effectiveItem.name);

                if (effectiveItem.images) {
                    for (const effectiveItem2Image of effectiveItem.images) {

                        await doInDbConnection(async (conn: Connection) => {
                            const qA: QueryA = await conn.query(`
                                SELECT 
                                    ID, DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT, CREATION_DATE, LAST_UPDATE
                                FROM TBL_DATA_IMPORT_FILE 
                                WHERE DATA_IMPORT_ID=? AND (NAME LIKE ? OR NAME LIKE ?)`, [dataImportId, `%/${effectiveItem2Image.name}`, `${effectiveItem2Image.name}`]);
                            // image exists in data import
                            if (qA.length) {
                               await addItemImage(i.id, qA[0].NAME, qA[0].CONTENT, false);
                            }
                        });
                    }
                }
            }

            await jobLogger.updateProgress("COMPLETED");
            await jobLogger.logInfo(`mark ${name} as completed`);

           fireEvent({
               type: "ImportItemJobEvent",
               state: 'Completed',
               jobId: jobLogger.jobId
           } as ImportItemJobEvent);
       } catch(e) {
            await jobLogger.logError(`${e.toString()}`);
            await jobLogger.updateProgress('FAILED');

           fireEvent({
               type: "ImportItemJobEvent",
               state: 'Completed',
               jobId: jobLogger.jobId
           } as ImportItemJobEvent);
       } finally {
           await jobLogger.logInfo(`Done with ${name}`);
       }

    })();

    return await getJobById(jobLogger.jobId);
}
