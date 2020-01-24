import {ActualPage} from "../actual.page";
import {AbstractPage} from "../abstract.page";


export class UserInvitationPage extends AbstractPage implements ActualPage<UserInvitationPage> {

    validateTitle(): UserInvitationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-invitation');
        return this;
    }

    visit(): UserInvitationPage {
        cy.visit('/user-gen-layout/(invitation//help:user-help)');
        return this;
    }
}
