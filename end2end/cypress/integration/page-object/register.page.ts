import {ActualPage} from "./actual.page";
import * as util from "../util/util";

export class RegisterPage implements ActualPage<RegisterPage> {

    visit(): RegisterPage {
        cy.visit(`/login-layout/register`);
        return this;
    }

    validateTitle(): RegisterPage {
        cy.get(`[test-page-title]`)
            .should('have.attr', 'test-page-title', 'settings');
        return this;
    }

    verifyErrorMessageExists(): RegisterPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): RegisterPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }


    fillIn(email: string, username: string, firstname: string, lastname: string, password:
        string, confirmPassword: string): RegisterPage {
        // email
        cy.get(`[test-field-email]`).clear({force: true}).then((_) => {
            if (email) {
                return cy.get(`[test-field-email]`).type(email, {force: true});
            }
        });

        // username
        cy.get(`[test-field-username]`).clear({force: true}).then((_) => {
            if (username) {
                return cy.get(`[test-field-username]`).type(username, {force: true});
            }
        });

        // firstname
        cy.get(`[test-field-firstname]`).clear({force: true}).then((_) => {
            if (firstname) {
                return cy.get(`[test-field-firstname]`).type(firstname, {force: true});
            }
        });

        // lastname
        cy.get(`[test-field-lastname]`).clear({force: true}).then((_) => {
            if (lastname) {
                return cy.get(`[test-field-lastname]`).type(lastname, {force: true});
            }
        });

        // password
        cy.get(`[test-field-password]`).clear({force: true}).then((_) => {
            if (password) {
                return cy.get(`[test-field-password]`).type(password, {force: true});
            }
        });

        // confirm password
        cy.get(`[test-field-confirm-password]`).clear({force: true}).then((_) => {
            if (confirmPassword) {
                return cy.get(`[test-field-confirm-password]`).type(confirmPassword, {force: true});
            }
        });

        return this;
    }

    verifyFormSubmittable(b: boolean): RegisterPage {
        cy.get(`[test-button-submit-registration]`).should(b ? 'be.enabled' : 'be.disabled');
        return this;
    }

    submitRegistration(): RegisterPage {
        cy.get(`[test-button-submit-registration]`).click({force: true});
        return this;
    }
}
