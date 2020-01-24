import {ActualPage} from "../actual.page";


export class UserRolesPage implements ActualPage<UserRolesPage> {

    validateTitle(): UserRolesPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-role');
        return this;
    }

    visit(): UserRolesPage {
        cy.visit('/user-gen-layout/(role//help:user-help)');
        return this;
    }

}
