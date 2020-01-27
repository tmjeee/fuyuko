import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import {LoginPage} from "./page-object/login.page";
import {UserInvitationPage} from "./page-object/sub-page-object/user-invitation.page";
import * as util from "./util/util";

describe("user-role", () => {

    let userInvitationPage: UserInvitationPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        userInvitationPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserInvitationPage();
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
        userInvitationPage
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
});
