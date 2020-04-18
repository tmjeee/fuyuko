import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class UserPeoplePage implements ActualPage<UserPeoplePage> {

    validateTitle(): UserPeoplePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-people');
        return this;
    }

    visit(): UserPeoplePage {
        cy.visit('/user-gen-layout/(people//help:user-help)');
        return this;
    }

    verifyErrorMessageExists(): UserPeoplePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): UserPeoplePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    toggleActiveUsersPanel(): UserPeoplePage {
        cy.get(`[test-expansion-panel-header='active-users']`)
            .click({force: true});
        return this;
    }

    verifyActiveUsersPanelExpanded(expanded: boolean): UserPeoplePage {
        cy.get(`[test-expansion-panel-content='active-users'] > *`)
            .should(expanded ? 'be.visible' : 'not.be.visible');
        return this;
    }

    toggleInactiveUsersPanel(): UserPeoplePage {
        cy.get(`[test-expansion-panel-header='inactive-users']`)
            .click({force: true});
        return this;
    }

    verifyInactiveUsersPanelExpanded(expanded: boolean): UserPeoplePage {
        cy.get(`[test-expansion-panel-content='inactive-users'] > *`)
            .should (expanded ? 'be.visible' : 'not.be.visible');
        return this;
    }

    openActiveUserPanel(): UserPeoplePage {
        cy.get(`[test-expansion-panel='active-users']`).then((n) => {
            if (!n.find(`[test-expansion-panel-content='active-users']`)
                .is(':visible')) {
                return cy.get(`[test-expansion-panel-header='active-users']`)
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    searchActiveUser(search: string): UserPeoplePage {
        cy.get(`[test-expansion-panel='active-users'] [test-field-search]`)
            .clear({force: true})
            .type(`${search}{enter}`, {force: true})
            .wait(3000);
        return this;
    }

    verifyUserDoesNotExistsInActiveUsersPanel(username: string): UserPeoplePage {
       cy.get(`[test-expansion-panel='active-users']`)
            .find(`[test-table-item-user='${username}']`).should('not.exist');
       return this;
    }

    verifyUserExistsInActiveUsersPanel(username: string): UserPeoplePage {
        cy.get(`[test-expansion-panel='active-users']`)
            .find(`[test-table-item-user='${username}']`).should('exist');
        return this;
    }


    verifyUserDoesNotExistsInInactiveUsersPanel(username: string): UserPeoplePage {
        cy.get(`[test-expansion-panel='inactive-users']`)
            .find(`[test-table-item-user='${username}']`).should('not.exist');
        return this;
    }

    verifyUserExistsInInactiveUsersPanel(username: string): UserPeoplePage {
        cy.get(`[test-expansion-panel='inactive-users']`)
            .find(`[test-table-item-user='${username}']`).should('exist');
        return this;
    }

    verifyActiveUsersSizeInTable(number: number) {
        cy.get(`[test-expansion-panel='active-users']`)
            .find(`[test-table-item-user]`).should('have.length', number);
        return this;
    }

    openInactiveUserPanel(): UserPeoplePage {
        cy.get(`[test-expansion-panel='inactive-users']`).then((n) => {
            if (!n.find(`[test-expansion-panel-content='inactive-users']`)
                .is(':visible')) {
                return cy.get(`[test-expansion-panel-header='inactive-users']`)
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    searchInactiveUser(search: string): UserPeoplePage {
        cy.get(`[test-expansion-panel='inactive-users'] [test-field-search]`)
            .clear({force: true})
            .type(`${search}{enter}`, {force: true})
            .wait(3000);
        return this;
    }


    verifyInactiveUsersSizeInTable(number: number) {
        cy.get(`[test-expansion-panel='inactive-users']`)
            .find(`[test-table-item-user]`).should('have.length', number);
        return this;
    }

    deactivateUser(username: string): UserPeoplePage {
        cy.get(`[test-expansion-panel='active-users']`)
            .find(`[test-icon-user-action='DEACTIVATE_${username}']`)
            .click({force: true})
        return this;
    }

    activateUser(username: string): UserPeoplePage {
        cy.get(`[test-expansion-panel='inactive-users']`)
            .find(`[test-icon-user-action='ACTIVATE_${username}']`)
            .click({force: true})
        return this;
    }
}
