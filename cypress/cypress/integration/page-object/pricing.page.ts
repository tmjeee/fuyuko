import {ActualPage} from "./actual.page";


export class PricingPage implements ActualPage<PricingPage> {

    constructor() { }

    visit(): PricingPage {
        cy.visit('/gen-layout/(pricing-structure//help:pricing-help)');
        return this;
    }

    validateTitle(): PricingPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'pricing');
        return this;
    }
}
