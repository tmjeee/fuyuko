import {Job} from "../model/job.model";
import {Attribute} from "../model/attribute.model";
import {JobLogger, newJobLogger} from "./job-log.service";

const uuid = require('uuid');


export const runJob = async (viewId: number, attributeDataImportId: number, attributes: Attribute[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `attribute-data-import-job-${uid}`;
    const description: string = `attribute-data-import-job-${uid} description`;


    const jobLogger: JobLogger = await newJobLogger(name, description);

    return null;
}