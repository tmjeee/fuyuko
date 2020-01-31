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
        cy.get(`[test-field-email]`).focus().clear({force: true});
        if (email) {
            cy.get(`[test-field-email]`).focus().type(email, {force: true});
        }

        // username
        cy.get(`[test-field-username]`).focus().clear({force: true});
        if (username) {
            cy.get(`[test-field-username]`).focus().type(username, {force: true});
        }

        // firstname
        cy.get(`[test-field-firstname]`).focus().clear({force: true});
        if (firstname) {
            cy.get(`[test-field-firstname]`).focus().type(firstname, {force: true});
        }

        // lastname
        cy.get(`[test-field-lastname]`).focus().clear({force: true});
        if (lastname) {
            cy.get(`[test-field-lastname]`).focus().type(lastname, {force: true});
        }

        // password
        cy.get(`[test-field-password]`).focus().clear({force: true});
        if (password) {
            cy.get(`[test-field-password]`).focus().type(password, {force: true});
        }

        // confirm password
        cy.get(`[test-field-confirm-password]`).focus().clear({force: true});
        if (confirmPassword) {
            cy.get(`[test-field-confirm-password]`).focus().type(confirmPassword, {force: true});
        }

        return this;
    }

    verifyFormSubmittable(b: boolean): RegisterPage {
        cy.get(`[test-button-submit-registration]`).should(b ? 'be.enabled' : 'be.disabled');
        return this;
    }

    submitRegistration(): RegisterPage {
        cy.get(`[test-button-submit-registration]`).focus().click({force: true});
        return this;
    }
}
