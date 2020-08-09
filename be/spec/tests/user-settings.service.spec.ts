import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {
    getSettings,
    getUserByUsername,
    updateUserSettings,
    UpdateUserSettingsInput
} from "../../src/service";
import {User} from "../../src/model/user.model";
import {Settings} from "../../src/model/settings.model";

describe('user-settings.service', () => {

    beforeAll(async (done: DoneFn) => {
        setupTestDatabase();
        setupBeforeAll2().then((_) => {
            done();
        });
    }, JASMINE_TIMEOUT);


    it('test updateUserSettings and getSettings', async () => {
        const viewer1 = await getUserByUsername('viewer1');
        const errs1: string[] = await updateUserSettings(viewer1.id, {
            "id": 1,
            "openHelpNav": true,
            "openSideNav": true,
            "openSubSideNav": false,
            "var1": "val1",
            "var2": "val2",
            "var3": "val3",
        } as UpdateUserSettingsInput);
        console.log('****** errs1', errs1);
        expect(errs1.length).toBe(0);

        console.log('******* viewer1', viewer1);
        const settings: Settings = await getSettings(viewer1.id);
        console.log('******* settings', settings);
        expect(settings.id).toBe(1);
        expect(settings.openHelpNav).toBe(true);
        expect(settings.openSideNav).toBe(true);
        expect(settings.openSubSideNav).toBe(false);
        expect((settings as any)['var1']).toBe('val1');
        expect((settings as any)['var2']).toBe('val2');
        expect((settings as any)['var3']).toBe('val3');
    });
});
