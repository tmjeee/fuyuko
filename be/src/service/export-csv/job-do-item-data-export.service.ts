import {Attribute} from '@fuyuko-common/model/attribute.model';
import {Job} from '@fuyuko-common/model/job.model';
import {JobLogger, newJobLogger} from '../job-log.service';
import {getJobById} from '../job.service';
import {Item, Value} from '@fuyuko-common/model/item.model';
import {doInDbConnection, QueryA, QueryResponse} from '../../db';
import {Connection} from 'mariadb';
import {Parser} from 'json2csv';
import JSON2CSVParser from 'json2csv/JSON2CSVParser';
import {convertToCsv} from '@fuyuko-common/shared-utils/ui-item-value-converters.util';
import {e} from '../../logger';
import JSZip from 'jszip';
import {ExportItemJobEvent, fireEvent} from '../event/event.service';

const uuid = require('uuid');

/**
 * =========================
 * === runJob ===
 * =========================
 */
export const runJob = async (viewId: number, attributes: Attribute[], items: Item[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `item-data-export-job-${uid}`;
    const description: string = `item-data-export-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);

    const zip = new JSZip();
    
    fireEvent({
        type: "ExportItemJobEvent",
        state: "Scheduled",
        jobId: jobLogger.jobId
    } as ExportItemJobEvent);

    (async ()=>{
        try {
            // id,name,description,att1,att2,att3,att4,att5
            const headers: string[] = ['id', 'name', 'description', 'image'];
            for (const attribute of attributes) {
                headers.push(attribute.name);
            }

            await jobLogger.logInfo(`created headers [${headers.join(',')}]`);

            const data: any[] = [];
            const parser: JSON2CSVParser<any> = new Parser({
                fields: headers
            });


            for (const item of items) {
                const imagePaths: string[] = [];
                const d: any = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    images: ''
                };

                for (const image of (item.images ? item.images : [])) {
                    const imageId: number = image.id;
                    await doInDbConnection(async (conn: Connection) => {
                        const q: QueryA = await conn.query(`SELECT CONTENT, NAME FROM TBL_ITEM_IMAGE WHERE ID=? AND ITEM_ID=? `, [imageId, item.id]);
                        if (q.length > 0) {
                            const imagePath: string = `item-${item.id}/image-${imageId}/${q[0].NAME}`;
                            const buffer: Buffer = q[0].CONTENT;
                            zip.file(imagePath, buffer, {binary: true});
                            imagePaths.push(imagePath);
                        }
                    });
                }
                d.image = (imagePaths.length ? imagePaths.join('|'): '');

                for (const attribute of attributes) {
                    const v: Value = item[attribute.id]
                    const val: string = convertToCsv(attribute, v);
                    d[attribute.name] = val;
                }
                data.push(d);
                await jobLogger.logInfo(`Created csv entry ${d}`);
            }

            const csv: string = parser.parse(data);
            zip.file('data.csv', csv, {binary: true});

            await doInDbConnection(async (conn: Connection) => {

                const q: QueryResponse = await conn.query(`
                    INSERT INTO TBL_DATA_EXPORT (VIEW_ID, NAME, TYPE) VALUES (?, ?, 'ITEM')
                `, [viewId, name]);
                const dataExportId: number = q.insertId;

                const buffer: Buffer = await zip.generateAsync({type: 'nodebuffer'});

                await conn.query(`
                    INSERT INTO TBL_DATA_EXPORT_FILE (DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)
                `, [dataExportId, name, 'application/zip', Buffer.byteLength(buffer), buffer]);

                await jobLogger.logInfo(`Put entry into db (dataExportId = ${dataExportId}`);
            });

            fireEvent({
                type: "ExportItemJobEvent",
                state: "Completed",
                jobId: jobLogger.jobId
            } as ExportItemJobEvent);
            
            await jobLogger.updateProgress('COMPLETED');
        } catch(err) {
            e(err.toString(), err);
            await jobLogger.logError(`${err.toString()}`);
            await jobLogger.updateProgress("FAILED");

            fireEvent({
                type: "ExportItemJobEvent",
                state: "Failed",
                jobId: jobLogger.jobId
            } as ExportItemJobEvent);
        } finally {
            await jobLogger.logInfo(`Done with ${name}`);
        }
    })();

    return await getJobById(jobLogger.jobId);
}
