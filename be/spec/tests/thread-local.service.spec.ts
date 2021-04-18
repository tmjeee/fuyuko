import {JASMINE_TIMEOUT, setupTestDatabase} from '../helpers/test-helper';


describe('thread-local.service', () => {

    beforeAll(async () => {
        setupTestDatabase();
    }, JASMINE_TIMEOUT);

    it('test ', async () => {
        expect(true).toBe(true);
    });

});