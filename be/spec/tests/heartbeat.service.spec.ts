import {heartbeat} from "../../src/service";

describe('heartbeat.service', () => {
    it(`heartbeat`, () => {
        const r = heartbeat();
        expect(r).toBeDefined();
    });
});