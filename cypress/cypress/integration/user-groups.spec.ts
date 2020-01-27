import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import {LoginPage} from "./page-object/login.page";
import {UserGroupPage} from "./page-object/sub-page-object/user-group.page";
import * as util from "./util/util";

describe("user-role", () => {

    let userGroupPage: UserGroupPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        userGroupPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserGroupPage();
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
        userGroupPage
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
