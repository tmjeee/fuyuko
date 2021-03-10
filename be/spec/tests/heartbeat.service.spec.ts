import {heartbeat} from '../../src/service';
import {setupTestDatabase} from '../helpers/test-helper';

describe('heartbeat.service', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    it(`heartbeat`, () => {
        const r = heartbeat();
        expect(r).toBeDefined();
    });
});