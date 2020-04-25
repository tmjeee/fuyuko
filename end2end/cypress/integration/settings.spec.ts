import {CustomImportPage} from "./page-object/sub-page-object/custom-import.page";
import {LoginPage} from "./page-object/login.page";
import {SettingsPage} from "./page-object/settings.page";
import set = Reflect.set;

describe('settings spec', () => {

    let settingsPage: SettingsPage;


    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // settingsPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitSettingsPage()
        // ;
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        settingsPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitSettingsPage()
        ;
        // cy.wait(1000); // wait for settings to be loaded
        // cy.waitUntil(() => cy.get(`[test-settings]`))
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        settingsPage
            .validateTitle()
        ;
    });

    //////////////////

    it(`should save settings #1`, () => {
        settingsPage
            .clickEnable(true, 'open-help-nav')
            .verifyEnable(true, 'open-help-nav')
            .clickSubmit()
            .verifySuccessMessageExists()

            .clickEnable(false, 'open-help-nav')
            .verifyEnable(false, 'open-help-nav')
            .clickSubmit()
            .verifySuccessMessageExists()

            .clickEnable(false, 'open-side-nav')
            .verifyEnable(false, 'open-side-nav')
            .clickSubmit()
            .verifySuccessMessageExists()

            .clickEnable(true, 'open-side-nav')
            .verifyEnable(true, 'open-side-nav')
            .clickSubmit()
            .verifySuccessMessageExists()

            .clickEnable(false, 'open-sub-side-nav')
            .verifyEnable(false, 'open-sub-side-nav')
            .clickSubmit()
            .verifySuccessMessageExists()

            .clickEnable(true, 'open-sub-side-nav')
            .verifyEnable(true, 'open-sub-side-nav')
            .clickSubmit()
            .verifySuccessMessageExists()
        ;
    })
});