import {ActualPage} from "../actual.page";
import * as util from '../../util/util';


const PAGE_NAME = 'user-group';
export class UserGroupPage implements ActualPage<UserGroupPage> {

    validateTitle(): UserGroupPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): UserGroupPage {
        cy.visit('/user-gen-layout/(group//help:user-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): UserGroupPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): UserGroupPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): UserGroupPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    //////////////////////////////////

    toggleGroupPanel(groupName: string): UserGroupPage {
        cy.waitUntil(() => cy.get(`[test-expansion-panel-header='${groupName}']`)).click({force: true});
        return this;
    }

    verifyRolePanelExpanded(groupName: string, expanded: boolean): UserGroupPage {
        cy.get(`[test-expansion-panel-content='${groupName}'] > *`)
            .should(expanded ? 'be.visible': 'not.be.visible');
        return this;
    }

    searchForAutoCompleteUserToAddToGroup(groupName: string, search: string, autoCompleteUsername: string): UserGroupPage {
        cy.waitUntil(() => cy.get(`[test-expansion-panel-content='${groupName}']
            [test-field-search]`))
            .clear({force: true})
            .type(search, {force: true})
            .wait(5000)
        cy.waitUntil(() => cy.get(`[test-auto-complete-option='${autoCompleteUsername}']`))
            .focus();
        cy.waitUntil(() => cy.get(`[test-auto-complete-option='${autoCompleteUsername}']`))
            .focus()
            .click({force: true});
        return this;
    }

    verifyUserInGroup(groupName: string, username: string): UserGroupPage {
        cy.waitUntil(()=>cy.get(`[test-expansion-panel-content='${groupName}']`))
            .find(`[test-table-item-user='${username}']`).then((n) => {
                return cy.wrap(n).should('exist');
            });
        return this;
    }

    clickDeleteUserFromGroupTable(groupName: string, username: string): UserGroupPage {
        cy.waitUntil(() => cy.get(`[test-expansion-panel-content='${groupName}']
            [test-icon-delete-user='${username}']`))
            .click({force: true});
        return this;
    }

    verifyUserInGroupDeleted(groupName: string, username: string): UserGroupPage {
        cy.waitUntil(() => cy.get(`[test-expansion-panel-content='${groupName}']`))
            .contains(`[test-table-item-user='${username}']`)
            .should('not.exist');
        return this;
    }
}
