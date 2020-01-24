import {AbstractPage} from "./abstract.page";
import {ActualPage} from "./actual.page";


export class PricingPage extends AbstractPage implements ActualPage<PricingPage> {

    visit(): PricingPage {
        cy.visit('/gen-layout/(pricing-structure//help:pricing-help)');
        return this;
    }

    validateTitle(): PricingPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'pricing');
        return this;
    }
}
