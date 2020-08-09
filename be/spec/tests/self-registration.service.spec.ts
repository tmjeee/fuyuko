import {
    approveSelfRegistration,
    ApproveSelfRegistrationResult, deleteSelfRegistration, getAllSelfRegistrations, searchSelfRegistrationsByUsername,
    selfRegister,
    SelfRegisterResult
} from "../../src/service";
import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {SelfRegistration} from "../../src/model/self-registration.model";
import * as util from "util";

describe('self-registration.service', () => {

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
    }, JASMINE_TIMEOUT);

    it('test selfRegister', async () => {
        const name = `XXX-self-registration-${Math.random()}`;
        const selfRegisterResult: SelfRegisterResult = await selfRegister(name, `${name}@gmail.com`, name,  name, 'xxx');
        expect(selfRegisterResult.errors.length).toBe(0);

        const selfRegistrations: SelfRegistration[]= await searchSelfRegistrationsByUsername(name);
        expect(selfRegistrations.length).toBe(1);

        const approveSelfRegistrationResult: ApproveSelfRegistrationResult = await approveSelfRegistration(selfRegisterResult.registrationId);
        expect(approveSelfRegistrationResult.errors.length).toBe(0);

        const r: boolean = await deleteSelfRegistration(selfRegistrations[0].id);
        expect(r).toBe(true);
    });


    it('test getAllSelfRegistrations', async () => {

        const selfRegistrations: SelfRegistration[] = await getAllSelfRegistrations();

        //console.log(util.inspect(selfRegistrations));
        expect(selfRegistrations).toBeTruthy();
        expect(selfRegistrations.length).toBeGreaterThan(5);
        expect(selfRegistrations[0].username).toBe('self1');
    });

});