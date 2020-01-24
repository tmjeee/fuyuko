import {ActualPage} from "../actual.page";
import {AbstractPage} from "../abstract.page";


export class UserGroupPage extends AbstractPage implements ActualPage<UserGroupPage> {

    validateTitle(): UserGroupPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-group');
        return this;
    }

    visit(): UserGroupPage {
        cy.visit('/user-gen-layout/(group//help:user-help)');
        return this;
    }

}
