import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {newConsoleLogger, newLoggingCallback, newJobLogger, JobLogger, LoggingCallback} from "../../src/service";

describe('job-log.service', () => {

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
    }, JASMINE_TIMEOUT);

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