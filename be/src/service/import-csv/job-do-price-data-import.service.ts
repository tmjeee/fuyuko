import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger, newLoggingCallback} from "../job-log.service";
import {getJobyById} from "../job.service";
import {PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {setPrices} from "../pricing-structure-item.service";

const uuid = require('uuid');


export const runJob = async (pricingStructureId: number, attributeDataImportId: number, priceItems: PricingStructureItemWithPrice[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `attribute-data-import-job-${uid}`;
    const description: string = `attribute-data-import-job-${uid} description`;


    const jobLogger: JobLogger = await newJobLogger(name, description);
    setPrices(pricingStructureId, priceItems);

    return await getJobyById(jobLogger.jobId);
}
