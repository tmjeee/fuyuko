import {ActualPage} from "../actual.page";

export class PartnerThubnailPage implements ActualPage<PartnerThubnailPage> {

    validateTitle(): PartnerThubnailPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'partner-thumbnail');
        return this;
    }

    visit(): PartnerThubnailPage {
        cy.visit('/partner-layout/(thumbnail//help:partner-help)');
        return this;
    }
}
