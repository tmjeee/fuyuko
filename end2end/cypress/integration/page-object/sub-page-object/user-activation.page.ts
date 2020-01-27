import {ActualPage} from "../actual.page";

export class UserActivationPage implements ActualPage<UserActivationPage> {

    validateTitle(): UserActivationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-activation');
        return this;
    }

    visit(): UserActivationPage {
        cy.visit('/user-gen-layout/(activation//help:user-help)');
        return this;
    }

}
