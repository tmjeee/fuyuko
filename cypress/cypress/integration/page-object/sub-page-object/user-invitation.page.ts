import {ActualPage} from "../actual.page";


export class UserInvitationPage implements ActualPage<UserInvitationPage> {

    validateTitle(): UserInvitationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-invitation');
        return this;
    }

    visit(): UserInvitationPage {
        cy.visit('/user-gen-layout/(invitation//help:user-help)');
        return this;
    }
}
