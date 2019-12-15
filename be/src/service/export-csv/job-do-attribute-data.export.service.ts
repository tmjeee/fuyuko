import {Attribute} from "../../model/attribute.model";
import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger} from "../job-log.service";
import {getJobyById} from "../job.service";
import {doInDbConnection, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {Parser} from "json2csv";
import JSON2CSVParser from "json2csv/JSON2CSVParser";

const uuid = require('uuid');


export const runJob = async (viewId: number, attributes: Attribute[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `attribute-data-export-job-${uid}`;
    const description: string = `attribute-data-export-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);
    // todo:

    (async ()=>{

        const headers: string[]  = [`name`,`description`,`type`,`format`,`showCurrencyCountry`,`pair1`,`pair2`];
        const data: any[] = [];

        for (const attribute of attributes) {
            data.push({
                name: attribute.name,
                description: attribute.description,
                type: attribute.type,
                format: attribute.format,
                showCurrencyCountry: attribute.showCurrencyCountry,
                pair1: attribute.pair1,
                pair2: attribute.pair2
            });
        }

        const parser: JSON2CSVParser<any> = new Parser({
            fields: headers
        });
        const csv: string = parser.parse(data);

        await doInDbConnection(async (conn: PoolConnection) => {
            const q: QueryResponse = await conn.query(`
                INSERT INTO TBL_DATA_EXPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ATTRIBUTE')
            `, [viewId, name]);
            const dataExportId: number = q.insertId;

            await conn.query(`
                INSERT INTO TBL_DATA_EXPORT_FILE (DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)
            `, [dataExportId, name, 'text/csv', Buffer.byteLength(csv), csv]);
        });
    })();

    return await getJobyById(jobLogger.jobId);
}
