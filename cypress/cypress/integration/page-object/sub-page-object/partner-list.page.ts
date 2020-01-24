import {ActualPage} from "../actual.page";

export class PartnerListPage implements ActualPage<PartnerListPage> {

    validateTitle(): PartnerListPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'partner-list');
        return this;
    }

    visit(): PartnerListPage {
        cy.visit('/partner-layout/(list//help:partner-help)');
        return this;
    }
}
