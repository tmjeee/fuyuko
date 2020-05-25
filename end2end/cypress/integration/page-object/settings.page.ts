import {ActualPage} from "./actual.page";
import * as util from '../util/util';


const PAGE_NAME = 'settings';
export class SettingsPage implements ActualPage<SettingsPage> {

    constructor() { }

    visit(): SettingsPage {
        cy.visit(`/gen-layout/(settings//help:settings-help)`);
        this.waitForReady();
        return this;
    }

    waitForReady(): SettingsPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    validateTitle(): SettingsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): SettingsPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): SettingsPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    ////////////////////////////////////

    clickEnable(b: boolean, name: string): SettingsPage {
        cy.waitUntil(() => cy.get(`[test-page-title]`)).then((_) => {
            const elem = _.find(`[test-slide-toggle='${name}']`);
            const hasClass = elem.hasClass('mat-checked');
            if(!hasClass && b) { // disabled and we want it enabled
                cy.waitUntil(() => cy.get(`[test-page-title]
                    [test-slide-toggle='${name}'] label div.mat-slide-toggle-bar`))
                    .click({force: true})
                    .wait(1000);
            } else if (hasClass && !b) { // enabled and we want it disabled
                cy.waitUntil(() => cy.get(`[test-page-title]
                    [test-slide-toggle='${name}'] label div.mat-slide-toggle-bar`))
                    .click({force: true})
                    .wait(1000);
            }
            return cy.wait(1000);
        });
        return this;
    }

    verifyEnable(b: boolean, name: string): SettingsPage {
        cy.waitUntil(() => cy.get(`[test-page-title]
            [test-slide-toggle='${name}']`))
            .should(b ? 'have.class' : 'not.have.class', 'mat-checked')
        return this;
    }

    clickSubmit(): SettingsPage {
        cy.waitUntil(() => cy.get(`[test-button-save]`)).click({force: true});
        return this;
    }
}
