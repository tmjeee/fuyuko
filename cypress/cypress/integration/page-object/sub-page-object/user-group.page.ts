import {ActualPage} from "../actual.page";


export class UserGroupPage implements ActualPage<UserGroupPage> {

    validateTitle(): UserGroupPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-group');
        return this;
    }

    visit(): UserGroupPage {
        cy.visit('/user-gen-layout/(group//help:user-help)');
        return this;
    }

}
