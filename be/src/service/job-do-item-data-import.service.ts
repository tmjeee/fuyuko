import {PricingStructureItemWithPrice} from "../model/pricing-structure.model";
import {Job} from "../model/job.model";
import {JobLogger, newJobLogger} from "./job-log.service";
import {getJobyById} from "./job.service";
import {Item} from "../model/item.model";
import {updateItem} from "./item.service";
import {revert} from "./conversion-item.service";
import {Item2} from "../route/model/server-side.model";

const uuid = require('uuid');

export const runJob = async (viewId: number, attributeDataImportId: number, items: Item[]): Promise<Job> => {
    const uid = uuid();
    const name: string = `attribute-data-import-job-${uid}`;
    const description: string = `attribute-data-import-job-${uid} description`;

    const jobLogger: JobLogger = await newJobLogger(name, description);

    const item2s: Item2[] = revert(items);
    for (const item2 of item2s) {
        updateItem(viewId, item2);
    }

    return await getJobyById(jobLogger.jobId);
}
