import {ActualPage} from "../actual.page";

export class UserPeoplePage implements ActualPage<UserPeoplePage> {

    validateTitle(): UserPeoplePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-people');
        return this;
    }

    visit(): UserPeoplePage {
        cy.visit('/user-gen-layout/(people//help:user-help)');
        return this;
    }

}
