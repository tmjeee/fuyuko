import {activateInvitation, ActivateInvitationResult, createInvitation, getInvitationByCode} from "../../src/service";
import {Invitation} from "../../src/model/invitation.model";
import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";


describe(`invitation.service`, () => {

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
    }, JASMINE_TIMEOUT);

    it(`create & validate`, async () => {
        // create invitation
        const errors: string[] = await createInvitation('asdasd@gmail.com', [1], false, 'testcode');
        expect(errors.length).toBe(0);

        // get invitation by code
        const invitation: Invitation = await getInvitationByCode('testcode');
        expect(invitation).toBeDefined();
        expect(invitation.activated).toBe(false);
        expect(invitation.email).toBe('asdasd@gmail.com');
        expect(invitation.groupIds.length).toBe(1);
        expect(invitation.groupIds).toContain(1);

        // activate invitation
        const name = `${Math.random()}`;
        const r: ActivateInvitationResult = await activateInvitation('testcode', `${name}`, `${name}@gmail.com`, `${name}`, `${name}`, `test`);
        expect(r.errors.length).toBe(0);
        expect(r.registrationId).toBeDefined();

        // get activated invitation
        const invitation2: Invitation = await getInvitationByCode('testcode');
        expect(invitation2.activated).toBe(true);
    });
});