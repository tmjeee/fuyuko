import {Attribute, Pair1, Pair2} from "../../model/attribute.model";
import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger} from "../job-log.service";
import {getJobById} from "../job.service";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {Parser} from "json2csv";
import JSON2CSVParser from "json2csv/JSON2CSVParser";
import {e} from '../../logger';
import {ExportAttributeJobEvent, fireEvent} from "../event/event.service";

const uuid = require('uuid');

/**
 *  =================
 *  === runJob =====
 *  =================
 */
export const runJob = async (viewId: number, attributes: Attribute[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `attribute-data-export-job-${uid}`;
    const description: string = `attribute-data-export-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);
    
    fireEvent({
        type: "ExportAttributeJobEvent",
        state: 'Scheduled',
        jobId: jobLogger.jobId
    } as ExportAttributeJobEvent);
    
    
    (async ()=>{

        await jobLogger.logInfo(`starting job ${name}`);

        const headers: string[]  = [`name`,`description`,`type`,`format`,`showCurrencyCountry`,`pair1`,`pair2`];
        const data: any[] = [];

        try {
            for (const attribute of attributes) {
                data.push({
                    name: attribute.name,
                    description: attribute.description,
                    type: attribute.type,
                    format: attribute.format,
                    creationDate: attribute.creationDate,
                    lastUpdate: attribute.lastUpdate,
                    showCurrencyCountry: attribute.showCurrencyCountry,
                    pair1: pair1ToCsv(attribute.pair1),
                    pair2: pair2ToCsv(attribute.pair2)
                });
            }

            const parser: JSON2CSVParser<any> = new Parser({
                fields: headers
            });
            const csv: string = parser.parse(data);

            await doInDbConnection(async (conn: Connection) => {
                const q: QueryResponse = await conn.query(`
                INSERT INTO TBL_DATA_EXPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ATTRIBUTE')
            `, [viewId, name]);
                const dataExportId: number = q.insertId;

                await conn.query(`
                INSERT INTO TBL_DATA_EXPORT_FILE (DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)
            `, [dataExportId, name, 'text/csv', Buffer.byteLength(csv), csv]);
            });

            await jobLogger.updateProgress('COMPLETED');

            fireEvent({
                type: "ExportAttributeJobEvent",
                state: 'Completed',
                jobId: jobLogger.jobId
            } as ExportAttributeJobEvent);
        } catch(err) {
            e(err.toString(), err);
            await jobLogger.logError(`${err.toString()}`);
            await jobLogger.updateProgress("FAILED");

            fireEvent({
                type: "ExportAttributeJobEvent",
                state: 'Failed',
                jobId: jobLogger.jobId
            } as ExportAttributeJobEvent);
        } finally {
            await jobLogger.logInfo(`Done with ${name}`);
        }
    })();

    return await getJobById(jobLogger.jobId);
}


const pair1ToCsv = (pair1s: Pair1[]): string => {
    const r: string =  (pair1s || []).map((p: Pair1) => `${p.key}=${p.value}`).join('|');
    return (r ? r : '');
}

const pair2ToCsv = (pair2s: Pair2[]): string => {
    const r: string =  (pair2s || []).map((p: Pair2) => `${p.key1}=${p.key2}=${p.value}`).join('|');
    return (r ? r : '');
}
