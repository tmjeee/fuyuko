import {setupTestDatabase} from "../helpers/test-helper";
import {newConsoleLogger, newLoggingCallback, newJobLogger, JobLogger, LoggingCallback} from "../../src/service";

describe('job-log.service', () => {

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
    
    it('newConsoleLogger', () => {
        const consoleLogger = newConsoleLogger;
        consoleLogger('INFO', 'testing');
    });
    
    it('newLoggingCallback', async () => {
        const jl: JobLogger = await newJobLogger('testJobLogger', 'test job logger');
        const lcb: LoggingCallback = newLoggingCallback(jl);
        lcb('INFO', 'testing testing logging call back');
    })
});