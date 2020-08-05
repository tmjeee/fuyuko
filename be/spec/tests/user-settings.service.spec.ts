import {JASMINE_TIMEOUT, setupBeforeAll, setupTestDatabase} from "../helpers/test-helper";
import {
    getGroupByName,
    getSettings,
    getUserByUsername,
    updateUserSettings,
    UpdateUserSettingsInput
} from "../../src/service";
import {User} from "../../src/model/user.model";
import {Settings} from "../../src/model/settings.model";


describe('user-settings.service', () => {

    let viewer1: User;

    beforeAll(() => {
        setupTestDatabase();
    });
    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);
    beforeAll(async () => {
        viewer1 = await getUserByUsername('viewer1');
    });


    it('test updateUserSettings and getSettings', async () => {

        const errs1: string[] = await updateUserSettings(viewer1.id, {
            "id": 1,
            "openHelpNav": true,
            "openSideNav": true,
            "openSubSideNav": false,
            "var1": "val1",
            "var2": "val2",
            "var3": "val3",
        } as UpdateUserSettingsInput);
        expect(errs1.length).toBe(0);

        const settings: Settings = await getSettings(viewer1.id);
        expect(settings.id).toBe(1);
        expect(settings.openHelpNav).toBe(true);
        expect(settings.openSideNav).toBe(true);
        expect(settings.openSubSideNav).toBe(false);
        expect((settings as any)['var1']).toBe('val1');
        expect((settings as any)['var2']).toBe('val2');
        expect((settings as any)['var3']).toBe('val3');
    });

});