import {ActualPage} from "./actual.page";
import * as util from '../util/util';


export class SettingsPage implements ActualPage<SettingsPage> {

    constructor() { }

    visit(): SettingsPage {
        cy.visit(`/gen-layout/(settings//help:settings-help)`);
        return this;
    }

    validateTitle(): SettingsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'settings');
        return this;
    }

    verifyErrorMessageExists(): SettingsPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): SettingsPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
