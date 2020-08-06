import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {getGroupByName, getUserByUsername} from "../../src/service";


describe('thread-local.service', () => {

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
    }, JASMINE_TIMEOUT);

    it('test ', () => {
        expect(true).toBe(true);
    });

});