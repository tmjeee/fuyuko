import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import {LoginPage} from "./page-object/login.page";
import {UserInvitationPage} from "./page-object/sub-page-object/user-invitation.page";
import * as util from "./util/util";

describe("user-role", () => {

    let userInvitationPage: UserInvitationPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // userInvitationPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitUserPage()
        //     .visitUserInvitationPage();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        userInvitationPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserInvitationPage();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
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

    it ('should toggle sub side nav', () => {
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(false);
        });
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(true);
        });
    });


    it ('should not allow send invitation', () => {
        userInvitationPage
            .fillIn('', 'group', null)
            .verifiedSendInvitationEnabled(false);

        userInvitationPage
            .fillIn('trest@asds.com', 'group')
            .verifiedSendInvitationEnabled(false);

        userInvitationPage
            .fillIn('', 'group', 'VIEW Group')
            .verifiedSendInvitationEnabled(false);
    });


    it ('should allow send invitation', () => {
        const random = String(Math.random());
        const email = `cypress-test-${random}@test.com`;
        userInvitationPage
            .fillIn(email, 'group', 'VIEW Group')
            .verifiedSendInvitationEnabled(true)
            .submitInvitation(10000)
            .verifyErrorMessageExists() // bad smtp password
            // .verifySuccessMessageExists()
        ;
    });
});
