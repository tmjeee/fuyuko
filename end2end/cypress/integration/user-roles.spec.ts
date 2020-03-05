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
        userRolePage.visit();
        util.toggleSideNav(() => {
            util.validateSideNavStateOpen(false);
        });
        util.toggleSideNav(() => {
            util.validateSideNavStateOpen(true);
        })
    });

    it ('should toggle help nav', () => {
        userRolePage.visit();
        util.toggleHelpSideNav(() => {
            util.validateHelpNavStateOpen(true);
        });
        util.toggleHelpSideNav(() => {
            util.validateHelpNavStateOpen(false);
        });
    });

    it ('should toggle sub side nav', () => {
        userRolePage.visit();
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(false);
        });
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(true);
        });
    });

    it ('VIEW role panel should toggle between exapand and collapsed', () => {
        userRolePage.visit();
        userRolePage
            .toggleRolePanel('VIEW')
            .verifyRolePanelExpanded('VIEW', true);
        userRolePage
            .toggleRolePanel('VIEW')
            .verifyRolePanelExpanded('VIEW', false);
    });


    it ('EDIT role panel should toggle between exapand and collapsed', () => {
        userRolePage.visit();
        userRolePage
            .toggleRolePanel('EDIT')
            .verifyRolePanelExpanded('EDIT', true);
        userRolePage
            .toggleRolePanel('EDIT')
            .verifyRolePanelExpanded('EDIT', false);
    });


    it ('ADMIN role panel should toggle between exapand and collapsed', () => {
        userRolePage.visit();
        userRolePage
            .toggleRolePanel('ADMIN')
            .verifyRolePanelExpanded('ADMIN', true);
        userRolePage
            .toggleRolePanel('ADMIN')
            .verifyRolePanelExpanded('ADMIN', false);
    });


    it ('PARTNER role panel should toggle between exapand and collapsed', () => {
        userRolePage.visit();
        userRolePage
            .toggleRolePanel('PARTNER')
            .verifyRolePanelExpanded('PARTNER', true);
        userRolePage
            .toggleRolePanel('PARTNER')
            .verifyRolePanelExpanded('PARTNER', false);
    });


    it ('should be able to add / remove group to / from VIEW role panel table', () => {
        const roleName = 'VIEW';
        const groupName1 = 'EDIT Group';
        const groupName2 = 'ADMIN Group';
        userRolePage.visit();
        userRolePage
            .toggleRolePanel(roleName)
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRole(roleName, groupName1)
            .verifyGroupInRole(roleName, groupName2)
            .clickDeleteGroupFromRoleTable(roleName, groupName1)
            .verifySuccessMessageExists()
            .clickDeleteGroupFromRoleTable(roleName, groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRoleDeleted(roleName, groupName1)
            .verifyGroupInRoleDeleted(roleName, groupName2);
    });

    it ('should be able to add / remove group to / from EDIT role panel table', () => {
        const roleName = 'EDIT';
        const groupName1 = 'VIEW Group';
        const groupName2 = 'ADMIN Group';
        userRolePage.visit();
        userRolePage
            .toggleRolePanel(roleName)
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRole(roleName, groupName1)
            .verifyGroupInRole(roleName, groupName2)
            .clickDeleteGroupFromRoleTable(roleName, groupName1)
            .verifySuccessMessageExists()
            .clickDeleteGroupFromRoleTable(roleName, groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRoleDeleted(roleName, groupName1)
            .verifyGroupInRoleDeleted(roleName, groupName2);
    });

    it ('should be able to add / remove group to / from ADMIN role panel table', () => {
        const roleName = 'ADMIN';
        const groupName1 = 'VIEW Group';
        const groupName2 = 'EDIT Group';
        userRolePage.visit();
        userRolePage
            .toggleRolePanel(roleName)
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRole(roleName, groupName1)
            .verifyGroupInRole(roleName, groupName2)
            .clickDeleteGroupFromRoleTable(roleName, groupName1)
            .verifySuccessMessageExists()
            .clickDeleteGroupFromRoleTable(roleName, groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRoleDeleted(roleName, groupName1)
            .verifyGroupInRoleDeleted(roleName, groupName2);
    });

    it ('should be able to add / remove group to / from PARTNER role panel table', () => {
        const roleName = 'PARTNER';
        const groupName1 = 'VIEW Group';
        const groupName2 = 'EDIT Group';
        userRolePage.visit();
        userRolePage
            .toggleRolePanel(roleName)
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName1)
            .verifySuccessMessageExists()
            .searchForAutoCompleteGroupToAddToRole(roleName, 'Group', groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRole(roleName, groupName1)
            .verifyGroupInRole(roleName, groupName2)
            .clickDeleteGroupFromRoleTable(roleName, groupName1)
            .verifySuccessMessageExists()
            .clickDeleteGroupFromRoleTable(roleName, groupName2)
            .verifySuccessMessageExists()
            .verifyGroupInRoleDeleted(roleName, groupName1)
            .verifyGroupInRoleDeleted(roleName, groupName2);
    });
});
