import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {getGroupByName, getUserByUsername} from "../../src/service";


describe('thread-local.service', () => {

    beforeAll(async () => {
        setupTestDatabase();
    }, JASMINE_TIMEOUT);

    it('test ', async () => {
        expect(true).toBe(true);
    });

});