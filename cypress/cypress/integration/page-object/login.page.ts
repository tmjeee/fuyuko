import {DashboardPage} from "./dashboard.page";
import {ActualPage} from "./actual.page";

export class LoginPage implements ActualPage<LoginPage> {

    visit(): LoginPage {
         cy.visit(`/login-layout/login`);
         return this;
    }

    validateTitle(): LoginPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'login');
        return this;
    }

    login(username: string, password: string): DashboardPage {
        cy.get(`[test-field-username]`).clear().type(username);
        cy.get(`[test-field-password]`).clear().type(password);
        cy.get(`[test-button-login]`).should('not.be.disabled').click();
        return new DashboardPage();
    }

}
