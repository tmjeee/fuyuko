import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import {LoginPage} from "./page-object/login.page";
import {UserGroupPage} from "./page-object/sub-page-object/user-group.page";
import * as util from "./util/util";

describe("user-role", () => {

    let userGroupPage: UserGroupPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // userGroupPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitUserPage()
        //     .visitUserGroupPage();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        userGroupPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserGroupPage();
        // cy.restoreLocalStorage();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
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

    it ('should toggle sub side nav', () => {
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(false);
        });
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(true);
        });
    });

    it (`'VIEW Group' panel should toggle between expand and collapse`, () => {
        userGroupPage
            .toggleGroupPanel('VIEW Group')
            .verifyRolePanelExpanded('VIEW Group', true);
        userGroupPage
            .toggleGroupPanel('VIEW Group')
            .verifyRolePanelExpanded('VIEW Group', false);
    });

    it (`'EDIT Group' panel should toggle between expand and collapse`, () => {
        userGroupPage
            .toggleGroupPanel('EDIT Group')
            .verifyRolePanelExpanded('EDIT Group', true);
        userGroupPage
            .toggleGroupPanel('EDIT Group')
            .verifyRolePanelExpanded('EDIT Group', false);
    });

    it (`'ADMIN Group' panel should toggle between expand and collapse`, () => {
        userGroupPage
            .toggleGroupPanel('ADMIN Group')
            .verifyRolePanelExpanded('ADMIN Group', true);
        userGroupPage
            .toggleGroupPanel('ADMIN Group')
            .verifyRolePanelExpanded('ADMIN Group', false);
    });

    it (`'PARTNER Group' panel should toggle between expand and collapse`, () => {
        userGroupPage
            .toggleGroupPanel('PARTNER Group')
            .verifyRolePanelExpanded('PARTNER Group', true);
        userGroupPage
            .toggleGroupPanel('PARTNER Group')
            .verifyRolePanelExpanded('PARTNER Group', false);
    });

    it(`should be able to add / remove user to / from 'VIEW Group' panel table`, () => {
        const groupName = 'VIEW Group';
        const userName1 = 'admin1';
        const userName2 = 'admin2';
        userGroupPage
            .toggleGroupPanel(groupName)
            .searchForAutoCompleteUserToAddToGroup(groupName, 'admin', userName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteUserToAddToGroup(groupName, 'admin', userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroup(groupName, userName1)
            .verifyUserInGroup(groupName, userName2)
            .clickDeleteUserFromGroupTable(groupName, userName1)
            .verifySuccessMessageExists()
            .clickDeleteUserFromGroupTable(groupName, userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroupDeleted(groupName, userName1)
            .verifyUserInGroupDeleted(groupName, userName2);
    });

    it (`should be able to add / remove user to / from 'EDIT Group' panel table`, () => {
        const groupName = 'EDIT Group';
        const userName1 = 'admin1';
        const userName2 = 'admin2';
        userGroupPage
            .toggleGroupPanel(groupName)
            .searchForAutoCompleteUserToAddToGroup(groupName, 'admin', userName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteUserToAddToGroup(groupName, 'admin', userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroup(groupName, userName1)
            .verifyUserInGroup(groupName, userName2)
            .clickDeleteUserFromGroupTable(groupName, userName1)
            .verifySuccessMessageExists()
            .clickDeleteUserFromGroupTable(groupName, userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroupDeleted(groupName, userName1)
            .verifyUserInGroupDeleted(groupName, userName2);

    });

    it (`should be able to add / remove user to / from 'ADMIN Group' panel table`, () => {

        const groupName = 'ADMIN Group';
        const userName1 = 'viewer1';
        const userName2 = 'viewer2';
        userGroupPage
            .toggleGroupPanel(groupName)
            .searchForAutoCompleteUserToAddToGroup(groupName, 'viewer', userName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteUserToAddToGroup(groupName, 'viewer', userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroup(groupName, userName1)
            .verifyUserInGroup(groupName, userName2)
            .clickDeleteUserFromGroupTable(groupName, userName1)
            .verifySuccessMessageExists()
            .clickDeleteUserFromGroupTable(groupName, userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroupDeleted(groupName, userName1)
            .verifyUserInGroupDeleted(groupName, userName2);
    });

    it (`should be able to add / remove user to / from 'PARTNER Group' panel table`, () => {

        const groupName = 'PARTNER Group';
        const userName1 = 'admin1';
        const userName2 = 'admin2';
        userGroupPage
            .toggleGroupPanel(groupName)
            .searchForAutoCompleteUserToAddToGroup(groupName, 'admin', userName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteUserToAddToGroup(groupName, 'admin', userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroup(groupName, userName1)
            .verifyUserInGroup(groupName, userName2)
            .clickDeleteUserFromGroupTable(groupName, userName1)
            .verifySuccessMessageExists()
            .clickDeleteUserFromGroupTable(groupName, userName2)
            .verifySuccessMessageExists()
            .verifyUserInGroupDeleted(groupName, userName1)
            .verifyUserInGroupDeleted(groupName, userName2);
    });
});
