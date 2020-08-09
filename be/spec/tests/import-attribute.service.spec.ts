import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";


describe(`import-attribute-service`, () => {

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
    }, JASMINE_TIMEOUT);

    it(`preview`, async () => {
        expect(true).toBe(true);
    });
});