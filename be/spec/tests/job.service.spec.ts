import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {getAllJobs, getJobById, getJobDetailsById} from '../../src/service';


describe('job.service', () => {
    const viewId = 2;

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2()
    }, JASMINE_TIMEOUT);

    it('test', async () => {
        await getAllJobs();
        await getJobById(1);
        await getJobDetailsById(1);
    });
    
});