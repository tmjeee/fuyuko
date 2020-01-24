import {AbstractPage} from "./abstract.page";
import {ActualPage} from "./actual.page";


export class SettingsPage extends AbstractPage implements ActualPage<SettingsPage> {

    visit(): SettingsPage {
        cy.visit(`/gen-layout/(settings//help:settings-help)`);
        return this;
    }

    validateTitle(): SettingsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'settings');
        return this;
    }
}
