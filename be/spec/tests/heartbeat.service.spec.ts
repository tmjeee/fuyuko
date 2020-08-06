import {heartbeat} from "../../src/service";
import {setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";

describe('heartbeat.service', () => {

    it(`heartbeat`, () => {
        const r = heartbeat();
        expect(r).toBeDefined();
    });
});