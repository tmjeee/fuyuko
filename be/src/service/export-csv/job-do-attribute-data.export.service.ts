import {Attribute} from "../../model/attribute.model";
import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger} from "../job-log.service";
import {getJobyById} from "../job.service";
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";

const uuid = require('uuid');


export const runJob = async (viewId: number, attributes: Attribute[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `attribute-data-import-job-${uid}`;
    const description: string = `attribute-data-import-job-${uid} description`;

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



        doInDbConnection((conn: PoolConnection) => {



        });
    })();

    return await getJobyById(jobLogger.jobId);
}
