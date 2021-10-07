import {Attribute} from '@fuyuko-common/model/attribute.model';
import {Job} from '@fuyuko-common/model/job.model';
import {JobLogger, newJobLogger} from '../job-log.service';
import {getJobById} from '../job.service';
import {doInDbConnection, QueryResponse} from '../../db';
import {Connection} from 'mariadb';
import {PricedItem, Value} from '@fuyuko-common/model/item.model';
import {Parser} from 'json2csv';
import JSON2CSVParser from 'json2csv/JSON2CSVParser';
import {convertToCsv} from '@fuyuko-common/shared-utils/ui-item-value-converters.util';
import {e} from '../../logger';
import {ExportPriceJobEvent, fireEvent} from '../event/event.service';


const uuid = require('uuid');

/**
 *  =====================
 *  === runJob ===
 *  =====================
 */
export const runJob = async (viewId: number, pricingStructureId: number, attributes: Attribute[], pricedItems: PricedItem[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `price-data-export-job-${uid}`;
    const description: string = `price-data-export-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);

    fireEvent({
        type: "ExportPriceJobEvent",
        state: "Scheduled",
        jobId: jobLogger.jobId
    } as ExportPriceJobEvent);

    await (async ()=>{

        try {
            // id,name,description,price,country,att1,att2,att3
            const headers: string[] = ['id', 'name', 'description', 'price', 'country'];
            for (const attribute of attributes) {
                headers.push(attribute.name);
            }
            await jobLogger.logInfo(`created headers [${headers.join(',')}]`);

            const data: any[] = [];
            const parser: JSON2CSVParser<any> = new Parser({
                fields: headers
            });

            for (const priceItem of pricedItems) {
                const d: any = {
                    id: priceItem.id,
                    name: priceItem.name,
                    description: priceItem.description,
                    price: priceItem.price,
                    country: priceItem.country,
                };

                for (const attribute of attributes) {
                   const v: Value = priceItem[attribute.id]
                   const val: string = convertToCsv(attribute, v);
                   d[attribute.name] = val;
                }
                data.push(d);
                await jobLogger.logInfo(`Created csv entry ${d}`);
            }

            const csv: string = parser.parse(data);

            await doInDbConnection(async (conn: Connection) => {

                const q: QueryResponse = await conn.query(`
                    INSERT INTO TBL_DATA_EXPORT (VIEW_ID, NAME, TYPE) VALUES (?, ?, 'PRICE')
                `, [viewId, name]);
                const dataExportId: number = q.insertId;

                await conn.query(`
                    INSERT INTO TBL_DATA_EXPORT_FILE (DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)
                `, [dataExportId, name, 'text/csv', Buffer.byteLength(csv), csv]);

                await jobLogger.logInfo(`Put entry into db (dataExportId = ${dataExportId}`);
            });

            await jobLogger.updateProgress('COMPLETED');

            fireEvent({
                type: "ExportPriceJobEvent",
                state: "Completed",
                jobId: jobLogger.jobId
            } as ExportPriceJobEvent);

        } catch(err) {
            e(err.toString(), err);
            await jobLogger.logError(`${err.toString()}`);
            await jobLogger.updateProgress("FAILED");

            fireEvent({
                type: "ExportPriceJobEvent",
                state: "Failed",
                jobId: jobLogger.jobId
            } as ExportPriceJobEvent);
        } finally {
            await jobLogger.logInfo(`Done with ${name}`);
        }
    })();

return await getJobById(jobLogger.jobId);
}
