import {PricingPage} from "../pricing.page";
import {CountryCurrencyUnits} from "../../model/unit.model";

export class EditPricingPopupPage {

    verifyPopupTitle(): EditPricingPopupPage {
        cy.get(`[test-popup-dialog-title='pricing-dialog-popup']`)
            .should('exist');
        return this;
    }


    editPrice(price: number): EditPricingPopupPage {
        cy.get(`[test-popup-dialog-title='pricing-dialog-popup']`)
            .find(`[test-field-price]`)
            .clear({force: true})
            .type(String(price), {force: true});
        return this;
    }

    editUnit(unit: CountryCurrencyUnits): EditPricingPopupPage {
        cy.get(`[test-popup-dialog-title='pricing-dialog-popup']`)
            .find(`[test-mat-select-price-unit]`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-price-unit='${unit}']`)
            .click({force: true});
        return this;
    }

    clickOk(): PricingPage {
        cy.get(`[test-popup-dialog-title='pricing-dialog-popup']`)
            .find(`[test-button-ok]`)
            .click({force: true});
        return new PricingPage().pricingTableReady();
    }

    clickCancel(): PricingPage {
        cy.get(`[test-popup-dialog-title='pricing-dialog-popup']`)
            .find(`[test-button-cancel]`)
            .click({force: true});
        return new PricingPage().pricingTableReady();
    }
}
