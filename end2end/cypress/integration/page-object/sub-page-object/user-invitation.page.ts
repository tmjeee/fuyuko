import {ActualPage} from "../actual.page";
import * as util from '../../util/util';


export class UserInvitationPage implements ActualPage<UserInvitationPage> {

    validateTitle(): UserInvitationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-invitation');
        return this;
    }

    visit(): UserInvitationPage {
        cy.visit('/user-gen-layout/(invitation//help:user-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): UserInvitationPage {
        util.waitUntilTestPageReady();
        cy.wait(2000);
        return this;
    }

    verifyErrorMessageExists(): UserInvitationPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): UserInvitationPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }


    fillIn(email: string, groupSearch: string, groupName?: string): UserInvitationPage {
        cy.get(`[test-field-email]`)
            .focus()
            .clear({force: true});
        if (email) {
            cy.get(`[test-field-email]`)
                .focus()
                .type(email, {force: true});
        }
        cy.get(`[test-field-groups`)
            .focus()
            .clear({force: true});
        if (groupSearch) {
            cy.get(`[test-field-groups`)
                .type(groupSearch, {force: true})
                .wait(5000);
        }
        if (groupName) {
            cy.get(`[test-autocomplete-option='${groupName}']`)
                .click({force: true});
        }
        return this;
    }

    verifiedSendInvitationEnabled(b: boolean): UserInvitationPage {
        cy.get(`[test-button-submit-invitation]`)
            .should(b ? 'be.enabled' : 'be.disabled');
        return this;
    }

    submitInvitation(wait?: number): UserInvitationPage {
        cy.get(`[test-button-submit-invitation]`)
            .should('be.enabled')
            .click({force: true});
        if (wait) {
            cy.wait(wait);
        }
       return this;
    }
}
