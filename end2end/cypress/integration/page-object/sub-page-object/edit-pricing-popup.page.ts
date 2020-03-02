import {PricingPage} from "../pricing.page";

export class EditPricingPopupPage {

    verifyPopupTitle(): this {
        cy.get(`[test-popup-dialog-title='pricing-dialog-popup']`)
            .should('exist');
        return this;
    }


}
