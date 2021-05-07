import Chainable = Cypress.Chainable;

export class LoginPage {
    visit(): Chainable<any> {
        cy.intercept('/*').as('api');
        return cy.visit('/login-layout/login')
            .then(() => cy.wait('@api'));
    }

    login(username: string, password: string): Chainable<any> {
        cy.intercept('/*').as('api');
        return cy.get('.login-page')
            .find('[test-field-username]')
            .clear()
            .type(`${username}`, {delay: 100})
            .then(() =>
                cy.get('.login-page')
                    .find('[test-field-password]')
                    .clear()
                    .type(`${password}`, {delay: 100}))
            .then(() =>
                cy.get('.login-page')
                    .find('[test-button-login')
                    .click())
            .then(() => cy.wait('@api'));
    }
}