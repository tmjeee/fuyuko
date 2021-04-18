import {setupTestDatabase} from '../helpers/test-helper';

describe('multipart.service', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    it('test', async () => {
        expect(true).toBe(true);
    });
});