import {heartbeat} from "../../src/service";
import {setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";

describe('heartbeat.service', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    it(`heartbeat`, () => {
        const r = heartbeat();
        expect(r).toBeDefined();
    });
});