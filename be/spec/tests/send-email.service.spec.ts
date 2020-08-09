import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";


describe('send-email.service', () => {

    beforeAll(async () => {
        setupTestDatabase();
    }, JASMINE_TIMEOUT);

    it('test', async () => {
        expect(true).toBe(true);
    });
});

