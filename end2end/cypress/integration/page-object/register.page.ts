import {ActualPage} from "./actual.page";
import * as util from "../util/util";

const PAGE_NAME = 'register'
export class RegisterPage implements ActualPage<RegisterPage> {

    visit(): RegisterPage {
        cy.visit(`/login-layout/register`);
        this.waitForReady();
        return this;
    }

    waitForReady(): RegisterPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    validateTitle(): RegisterPage {
        cy.get(`[test-page-title]`)
            .should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): RegisterPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): RegisterPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }


    fillIn(email: string, username: string, firstname: string, lastname: string, password:
        string, confirmPassword: string): RegisterPage {
        // email
        cy.waitUntil(() => cy.get(`[test-field-email]`)).clear({force: true}).then((_) => {
            if (email) {
                cy.waitUntil(() => cy.get(`[test-field-email]`)).type(email, {force: true});
            }
            return cy.wait(1000);
        });

        // username
        cy.waitUntil(() => cy.get(`[test-field-username]`)).clear({force: true}).then((_) => {
            if (username) {
                cy.waitUntil(() => cy.get(`[test-field-username]`)).type(username, {force: true});
            }
            return cy.wait(1000);
        });

        // firstname
        cy.waitUntil(() => cy.get(`[test-field-firstname]`)).clear({force: true}).then((_) => {
            if (firstname) {
                cy.waitUntil(() => cy.get(`[test-field-firstname]`)).type(firstname, {force: true});
            }
            return cy.wait(1000);
        });

        // lastname
        cy.waitUntil(() => cy.get(`[test-field-lastname]`)).clear({force: true}).then((_) => {
            if (lastname) {
                cy.waitUntil(() => cy.get(`[test-field-lastname]`)).type(lastname, {force: true});
            }
            return cy.wait(1000);
        });

        // password
        cy.waitUntil(() => cy.get(`[test-field-password]`)).clear({force: true}).then((_) => {
            if (password) {
                cy.waitUntil(() => cy.get(`[test-field-password]`)).type(password, {force: true});
            }
            return cy.wait(1000);
        });

        // confirm password
        cy.waitUntil(() => cy.get(`[test-field-confirm-password]`)).clear({force: true}).then((_) => {
            if (confirmPassword) {
                cy.waitUntil(() => cy.get(`[test-field-confirm-password]`)).type(confirmPassword, {force: true});
            }
            return cy.wait(1000);
        });

        return this;
    }

    verifyFormSubmittable(b: boolean): RegisterPage {
        cy.waitUntil(() => cy.get(`[test-button-submit-registration]`)).should(b ? 'be.enabled' : 'be.disabled');
        return this;
    }

    submitRegistration(): RegisterPage {
        cy.waitUntil(() => cy.get(`[test-button-submit-registration]`)).click({force: true});
        return this;
    }
}
