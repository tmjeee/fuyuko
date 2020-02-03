import {ActualPage} from "./actual.page";
import * as util from '../util/util';


export class ProfilePage  implements ActualPage<ProfilePage> {

    constructor() { }

    visit(): ProfilePage {
        cy.visit(`/gen-layout/(profile//help:profile-help)`);
        return this;
    }

    validateTitle(): ProfilePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'profile');
        return this;
    }

    changePredefinedAvatar(predefinedAvatarName: string): ProfilePage {
        cy.get(`[test-edit-avatar-icon]`).click();
        cy.get(`[test-predefined-avatar-name='${predefinedAvatarName}']`).click();
        cy.get(`[test-change-avatar-button]`).click();
        return this;
    }

    validateAvatarChanged(name: string): ProfilePage {
        const apiBaseUrl = Cypress.env('apiBaseUrl').toString();
        const userId = util.getMyself().myself.id;
        cy.request(`${apiBaseUrl}/user/${userId}/avatar-info`)
            .its("body")
            .then((body: any) => {
                expect(body).to.have.property('name');
                expect(body.name).to.eq(name);
            });
        return this;
    }

    changeProfileDetails(firstName: string, lastName: string, email: string): ProfilePage {
        cy.get('[test-field-firstName]').clear().type(firstName);
        cy.get('[test-field-lastName]').clear().type(lastName);
        cy.get('[test-field-email]').clear().type(email);
        cy.get('[test-profile-submit-button]').click();
        return this;
    }

    validateProfileChanged(firstName: string, lastName: string, email: string): ProfilePage {
        this.visit();
        cy.get('[test-field-firstName').should('have.value', firstName);
        cy.get('[test-field-lastName').should('have.value', lastName);
        cy.get('[test-field-email').should('have.value', email);
        return this;
    }

    changePassword(password: string, confirmedPassword: string) {
       cy.get('[test-field-password]').clear({force: true}).type(password, {force: true});
       cy.get('[test-field-confirmPassword]').clear({force: true}).type(confirmedPassword, {force: true});
       return this;
    }

    getPasswordSubmitButton(): Cypress.Chainable<any> {
        return cy.get('[test-password-submit-button');
    }

    changeTheme(cssThemeName: string): ProfilePage {
        cy.get('[test-theme-select]').click({force: true});
        cy.get(`[test-theme-select-option='${cssThemeName}']`).click({force: true});
        return this;
    }

    validateThemeChanged(cssThemeName: string): ProfilePage {
        cy.get(`[test-theme-cssClassName]`).then((n) => {
            expect(n).to.have.attr('test-theme-cssClassName').eq(cssThemeName);
        })
        return this;
    }

    verifyErrorMessageExists(): ProfilePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ProfilePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
