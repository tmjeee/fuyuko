import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import {LoginPage} from "./page-object/login.page";
import {UserPeoplePage} from "./page-object/sub-page-object/user-people.page";
import * as util from "./util/util";

describe("user-role", () => {

    let userPeoplePage: UserPeoplePage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // userPeoplePage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitUserPage()
        //     .visitUserPeoplePage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        userPeoplePage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserPeoplePage();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });


    it ('should load', () => {
        userPeoplePage
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

    it ('Active users panel should toggle between expand and collapse', () => {
        userPeoplePage
            .toggleActiveUsersPanel()
            .verifyActiveUsersPanelExpanded(true);
        userPeoplePage
            .toggleActiveUsersPanel()
            .verifyActiveUsersPanelExpanded(false);
    });


    it ('Inactive users panel should toggle between exapand and collapse', () => {
        userPeoplePage
            .toggleInactiveUsersPanel()
            .verifyInactiveUsersPanelExpanded(true);
        userPeoplePage
            .toggleInactiveUsersPanel()
            .verifyInactiveUsersPanelExpanded(false);
    });

    it ('Search activate users from Active Users Panel', () => {
        // try to DEACTIVATE them
        userPeoplePage
            .openActiveUserPanel()
            .searchActiveUser('viewer')
            .verifyActiveUsersSizeInTable(9)
            .verifyUserExistsInActiveUsersPanel('viewer1')
            .verifyUserExistsInActiveUsersPanel('viewer2')
            .verifyUserExistsInActiveUsersPanel('viewer3')
            .verifyUserExistsInActiveUsersPanel('viewer4')
            .verifyUserExistsInActiveUsersPanel('viewer5')
            .verifyUserExistsInActiveUsersPanel('viewer6')
            .verifyUserExistsInActiveUsersPanel('viewer7')
            .verifyUserExistsInActiveUsersPanel('viewer8')
            .verifyUserExistsInActiveUsersPanel('viewer9')
            .deactivateUser('viewer1')
            .verifySuccessMessageExists()
            .verifyActiveUsersSizeInTable(8)
            .deactivateUser('viewer2')
            .verifySuccessMessageExists()
            .verifyActiveUsersSizeInTable(7)
            .verifyUserDoesNotExistsInActiveUsersPanel('viewer1')
            .verifyUserDoesNotExistsInActiveUsersPanel('viewer2')
            .verifyUserExistsInActiveUsersPanel('viewer3')
            .verifyUserExistsInActiveUsersPanel('viewer4')
            .verifyUserExistsInActiveUsersPanel('viewer5')
            .verifyUserExistsInActiveUsersPanel('viewer6')
            .verifyUserExistsInActiveUsersPanel('viewer7')
            .verifyUserExistsInActiveUsersPanel('viewer8')
            .verifyUserExistsInActiveUsersPanel('viewer9')
        ;

        userPeoplePage
            .openInactiveUserPanel()
            .searchInactiveUser('viewer')
            .verifyInactiveUsersSizeInTable(2)
            .verifyUserExistsInInactiveUsersPanel('viewer1')
            .verifyUserExistsInInactiveUsersPanel('viewer2')
            .activateUser('viewer1')
            .verifySuccessMessageExists()
            .verifyInactiveUsersSizeInTable(1)
            .activateUser('viewer2')
            .verifySuccessMessageExists()
            .verifyInactiveUsersSizeInTable(0)
        ;
    });

    it ('Search inactivate users from Inactive Users Panel', () => {
        //  try to ACTIVATE them
        userPeoplePage
            .openInactiveUserPanel()
            .searchInactiveUser('disabled')
            .verifyInactiveUsersSizeInTable(9)
            .verifyUserExistsInInactiveUsersPanel('disabled1')
            .verifyUserExistsInInactiveUsersPanel('disabled2')
            .verifyUserExistsInInactiveUsersPanel('disabled3')
            .verifyUserExistsInInactiveUsersPanel('disabled4')
            .verifyUserExistsInInactiveUsersPanel('disabled5')
            .verifyUserExistsInInactiveUsersPanel('disabled6')
            .verifyUserExistsInInactiveUsersPanel('disabled7')
            .verifyUserExistsInInactiveUsersPanel('disabled8')
            .verifyUserExistsInInactiveUsersPanel('disabled9')
            .activateUser('disabled1')
            .verifySuccessMessageExists()
            .verifyInactiveUsersSizeInTable(8)
            .activateUser('disabled2')
            .verifySuccessMessageExists()
            .verifyInactiveUsersSizeInTable(7)
            .verifyUserDoesNotExistsInInactiveUsersPanel('disabled1')
            .verifyUserDoesNotExistsInInactiveUsersPanel('disabled2')
            .verifyUserExistsInInactiveUsersPanel('disabled3')
            .verifyUserExistsInInactiveUsersPanel('disabled4')
            .verifyUserExistsInInactiveUsersPanel('disabled5')
            .verifyUserExistsInInactiveUsersPanel('disabled6')
            .verifyUserExistsInInactiveUsersPanel('disabled7')
            .verifyUserExistsInInactiveUsersPanel('disabled8')
            .verifyUserExistsInInactiveUsersPanel('disabled9')
        ;

        userPeoplePage
            .openActiveUserPanel()
            .searchActiveUser('disabled')
            .verifyActiveUsersSizeInTable(2)
            .verifyUserExistsInActiveUsersPanel('disabled1')
            .verifyUserExistsInActiveUsersPanel('disabled2')
            .deactivateUser('disabled1')
            .verifySuccessMessageExists()
            .verifyActiveUsersSizeInTable(1)
            .deactivateUser('disabled2')
            .verifySuccessMessageExists()
            .verifyActiveUsersSizeInTable(0)
        ;
    });
});
