import {ActualPage} from "../actual.page";
import * as util from '../../util/util';


const PAGE_NAME = 'user-invitation';
export class UserInvitationPage implements ActualPage<UserInvitationPage> {

    validateTitle(): UserInvitationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): UserInvitationPage {
        cy.visit('/user-gen-layout/(invitation//help:user-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): UserInvitationPage {
        util.waitUntilTestPageReady(PAGE_NAME);
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
        cy.waitUntil(() => cy.get(`[test-field-email]`))
            .focus()
            .clear({force: true});
        cy.wrap(email).then((_) => {
            if (email) {
                cy.waitUntil(() => cy.get(`[test-field-email]`))
                    .focus()
                    .type(email, {force: true});
            }
        });
        cy.waitUntil(() => cy.get(`[test-field-groups`))
            .focus()
            .clear({force: true});
        cy.wrap(groupSearch).then((_) => {
            if (groupSearch) {
                cy.get(`[test-field-groups`)
                    .type(groupSearch, {force: true})
                    .wait(5000);
            }
        });
        cy.wrap(groupName).then((_) => {
            if (groupName) {
                cy.get(`[test-autocomplete-option='${groupName}']`)
                    .click({force: true});
            }
        });
        return this;
    }

    verifiedSendInvitationEnabled(b: boolean): UserInvitationPage {
        cy.waitUntil(() => cy.get(`[test-button-submit-invitation]`))
            .should(b ? 'be.enabled' : 'be.disabled');
        return this;
    }

    submitInvitation(wait?: number): UserInvitationPage {
        cy.waitUntil(() => cy.get(`[test-button-submit-invitation]`))
            .should('be.enabled')
            .click({force: true});
        cy.wrap((wait)).then((_) => {
            if (wait) {
                cy.wait(wait);
            }
        });
       return this;
    }
}
