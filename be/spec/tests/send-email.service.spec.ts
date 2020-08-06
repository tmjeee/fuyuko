import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {getGroupByName, getUserByUsername} from "../../src/service";


describe('send-email.service', () => {

    beforeAll(async () => {
        try {
            await setupTestDatabase();
            await setupBeforeAll2();
        } catch(err) {
            console.error(err, err);
        }
    }, JASMINE_TIMEOUT);

    it('test', () => {
        expect(true).toBe(true);
    });
});

