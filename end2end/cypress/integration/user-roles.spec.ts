import {LoginPage} from "./page-object/login.page";
import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import * as util from "./util/util";


describe("user-role", () => {

    let userRolePage: UserRolesPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        userRolePage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserRolePage();
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
        userRolePage
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

    it ('VIEW should toggle between exapand and collapsed', () => {
        userRolePage
            .toggleRole('VIEW')
            .verifyRolePanelExpanded('VIEW', true);
        userRolePage
            .toggleRole('VIEW')
            .verifyRolePanelExpanded('VIEW', false);
    });


    it ('EDIT should toggle between exapand and collapsed', () => {
        userRolePage
            .toggleRole('EDIT')
            .verifyRolePanelExpanded('EDIT', true);
        userRolePage
            .toggleRole('EDIT')
            .verifyRolePanelExpanded('EDIT', false);
    });


    it ('ADMIN should toggle between exapand and collapsed', () => {
        userRolePage
            .toggleRole('ADMIN')
            .verifyRolePanelExpanded('ADMIN', true);
        userRolePage
            .toggleRole('ADMIN')
            .verifyRolePanelExpanded('ADMIN', false);
    });


    it ('EDIT should toggle between exapand and collapsed', () => {
        userRolePage
            .toggleRole('PARTNER')
            .verifyRolePanelExpanded('PARTER', true);
        userRolePage
            .toggleRole('PARTNER')
            .verifyRolePanelExpanded('PARTNER', false);
    });


    it ('should be able to add group to VIEW role', () => {
        userRolePage
            .toggleRole('VIEW')
            .searchRole('VIEW', 'Group', 'EDIT Group');
    });
});