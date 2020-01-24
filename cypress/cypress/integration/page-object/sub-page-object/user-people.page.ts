import {ActualPage} from "../actual.page";
import {AbstractPage} from "../abstract.page";

export class UserPeoplePage extends AbstractPage implements ActualPage<UserPeoplePage> {

    validateTitle(): UserPeoplePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-people');
        return this;
    }

    visit(): UserPeoplePage {
        cy.visit('/user-gen-layout/(people//help:user-help)');
        return this;
    }

}
