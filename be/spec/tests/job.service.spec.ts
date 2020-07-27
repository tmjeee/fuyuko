import {Item} from "../../src/model/item.model";
import {JASMINE_TIMEOUT, setupBeforeAll, setupTestDatabase} from "../helpers/test-helper";
import {getAllJobs, getItemByName, getJobById, getJobDetailsById} from "../../src/service";


describe('job.service', () => {
    const viewId = 2;

    beforeAll(() => {
        setupTestDatabase();
    });
    /*
    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);
     */

    beforeAll(async () => {
    });
    
    it('test', async () => {
        await getAllJobs();
        await getJobById(1);
        await getJobDetailsById(1);
    });
    
});