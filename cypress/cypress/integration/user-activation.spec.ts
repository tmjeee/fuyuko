import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import {LoginPage} from "./page-object/login.page";
import {UserActivationPage} from "./page-object/sub-page-object/user-activation.page";
import * as util from "./util/util";

describe("user-role", () => {

    let userActivationPage: UserActivationPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        userActivationPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserActivationPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });


    it ('should load', () => {
        userActivationPage
            .visit()
            .validateTitle();
    });

    it ('should toggle side nav', () => {
        util.toggleSideNav(() => {
            util.validateSideNavStateOpen(false);
        });
        util.toggleSideNav(() => {
            util.validateSideNavStateOpen(true);
        })
    });

    it ('should toggle help nav', () => {
        util.toggleHelpSideNav(() => {
            util.validateHelpNavStateOpen(true);
        });
        util.toggleHelpSideNav(() => {
            util.validateHelpNavStateOpen(false);
        });
    });

    it ('should toggle sub side nav', () => {
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(false);
        });
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(true);
        });
    });

});
