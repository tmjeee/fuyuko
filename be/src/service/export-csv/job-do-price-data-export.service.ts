import {Attribute} from "../../model/attribute.model";
import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger} from "../job-log.service";
import {getJobyById} from "../job.service";
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";

const uuid = require('uuid');


export const runJob = async (viewId: number, attributes: Attribute[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `attribute-data-export-job-${uid}`;
    const description: string = `attribute-data-export-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);
    // todo:


    await doInDbConnection(async (conn: PoolConnection) => {

        conn.query(`
            INSERT INTO TBL_DATA_EXPORT (VIEW_ID) VALUES (?)
        `, [viewId])

    });

    return await getJobyById(jobLogger.jobId);
}
