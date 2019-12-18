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
    (async ()=>{
        await jobLogger.logInfo(`starting job ${name}`);
        try {
            await setPrices(pricingStructureId, priceItems, newLoggingCallback(jobLogger));
            await jobLogger.updateProgress("COMPLETED");
            await jobLogger.logInfo(`mark ${name} as completed`);
        } catch(e) {
            await jobLogger.logError(`${e.toString()}`);
            await jobLogger.updateProgress("FAILED");
        } finally {
            await jobLogger.logInfo(`Done with ${name}`);
        }
    })();

    return await getJobyById(jobLogger.jobId);
}
