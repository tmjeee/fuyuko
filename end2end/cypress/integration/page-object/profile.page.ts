import {ActualPage} from "./actual.page";
import * as util from '../util/util';


const PAGE_NAME = 'profile';
export class ProfilePage  implements ActualPage<ProfilePage> {

    constructor() { }

    visit(): ProfilePage {
        cy.visit(`/gen-layout/(profile//help:profile-help)`);
        this.waitForReady();
        return this;
    }

    waitForReady(): ProfilePage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    validateTitle(): ProfilePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    changePredefinedAvatar(predefinedAvatarName: string): ProfilePage {
        cy.waitUntil(() => cy.get(`[test-edit-avatar-icon]`)).click({force: true});
        cy.waitUntil(() => cy.get(`[test-predefined-avatar-name='${predefinedAvatarName}']`)).click({force: true});
        cy.waitUntil(() => cy.get(`[test-change-avatar-button]`)).click({force: true}).wait(100);
        return this;
    }

    validateAvatarChanged(name: string): ProfilePage {
        const apiBaseUrl = Cypress.env('apiBaseUrl').toString();
        const userId = util.getMyself().myself.id;
        cy.wait(100).request(`${apiBaseUrl}/user/${userId}/avatar-info`)
            .its("body")
            .then((body: any) => {
                expect(body).to.have.property('payload');
                expect(body.payload).to.have.property('name');
                expect(body.payload.name).to.eq(name);
                return cy.wait(1000);
            });
        return this;
    }

    changeProfileDetails(firstName: string, lastName: string, email: string): ProfilePage {
        cy.waitUntil(() => cy.get('[test-field-firstName]')).clear().type(firstName);
        cy.waitUntil(() => cy.get('[test-field-lastName]')).clear().type(lastName);
        cy.waitUntil(() => cy.get('[test-field-email]')).clear().type(email);
        cy.waitUntil(() => cy.get('[test-profile-submit-button]')).click({force: true});
        return this;
    }

    validateProfileChanged(firstName: string, lastName: string, email: string): ProfilePage {
        this.visit();
        cy.waitUntil(() => cy.get('[test-field-firstName')).should('have.value', firstName);
        cy.waitUntil(() => cy.get('[test-field-lastName')).should('have.value', lastName);
        cy.waitUntil(() => cy.get('[test-field-email')).should('have.value', email);
        return this;
    }

    changePassword(password: string, confirmedPassword: string) {
       cy.waitUntil(() => cy.get('[test-field-password]')).clear({force: true}).type(password, {force: true});
       cy.waitUntil(() => cy.get('[test-field-confirmPassword]')).clear({force: true}).type(confirmedPassword, {force: true});
       return this;
    }

    getPasswordSubmitButton(): Cypress.Chainable<any> {
        return cy.waitUntil(() => cy.get('[test-password-submit-button'));
    }

    changeTheme(cssThemeName: string): ProfilePage {
        cy.waitUntil(() => cy.get('[test-theme-select]')).click({force: true});
        cy.waitUntil(() => cy.get(`[test-theme-select-option='${cssThemeName}']`)).click({force: true});
        return this;
    }

    validateThemeChanged(cssThemeName: string): ProfilePage {
        cy.waitUntil(() => cy.get(`[test-theme-cssClassName]`)).then((n) => {
            expect(n).to.have.attr('test-theme-cssClassName').eq(cssThemeName);
            return cy.wait(1000);
        });
        return this;
    }

    verifyErrorMessageExists(): ProfilePage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ProfilePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }
}
