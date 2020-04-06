import {CustomImportPage} from "./page-object/sub-page-object/custom-import.page";
import {LoginPage} from "./page-object/login.page";
import {SettingsPage} from "./page-object/settings.page";
import set = Reflect.set;

describe('settings spec', () => {

    let settingsPage: SettingsPage;


    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');

        // create new view
        settingsPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitSettingsPage()
        ;
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        settingsPage.visit();
        cy.wait(1000);
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        settingsPage
            .visit()
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