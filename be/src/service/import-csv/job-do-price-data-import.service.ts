import {Job} from "../../model/job.model";
import {JobLogger, newJobLogger, newLoggingCallback} from "../job-log.service";
import {getJobById} from "../job.service";
import {PriceDataItem, PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {setPrices} from "../pricing-structure-item.service";
import {fireEvent, ImportItemJobEvent, ImportPriceJobEvent} from "../event/event.service";

const uuid = require('uuid');

/**
 *  ====================================
 *  === runJob ===
 *  ====================================
 */
export const runJob = async (viewId: number, dataImportId: number, priceDataItems: PriceDataItem[]): Promise<Job> => {

    const uid = uuid();
    const name: string = `price-data-import-job-${uid}`;
    const description: string = `price-data-import-job-${uid} description`;


    const jobLogger: JobLogger = await newJobLogger(name, description);

    fireEvent({
        type: "ImportPriceJobEvent",
        state: 'Scheduled',
        jobId: jobLogger.jobId
    } as ImportPriceJobEvent);
    
    
    (async ()=>{
        await jobLogger.logInfo(`starting job ${name}`);
        try {
            const errors: string[] = await setPrices(priceDataItems, newLoggingCallback(jobLogger));
            if (errors && errors.length) {
                for (const error of errors) {
                    await jobLogger.logError(error);
                }
                await jobLogger.updateProgress("FAILED");

                fireEvent({
                    type: "ImportPriceJobEvent",
                    state: 'Failed',
                    jobId: jobLogger.jobId
                } as ImportPriceJobEvent);
            } else {
                await jobLogger.updateProgress("COMPLETED");
                await jobLogger.logInfo(`mark ${name} as completed`);

                fireEvent({
                    type: "ImportPriceJobEvent",
                    state: 'Completed',
                    jobId: jobLogger.jobId
                } as ImportPriceJobEvent);
            }
        } catch(e) {
            await jobLogger.logError(`${e.toString()}`);
            await jobLogger.updateProgress("FAILED");

            fireEvent({
                type: "ImportPriceJobEvent",
                state: 'Failed',
                jobId: jobLogger.jobId
            } as ImportPriceJobEvent);
        } finally {
            await jobLogger.logInfo(`Done with ${name}`);
        }
    })();

    return await getJobById(jobLogger.jobId);
}
