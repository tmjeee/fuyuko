import {PricingPage} from "../pricing.page";

export class EditPricingStructurePopupPage {

    verifyPopupTitle(): this {
        cy.get(`[test-popup-dialog-title='pricing-structure-dialog-popup']`)
            .should('exist');
        return this;
    }


    editName(name: string): EditPricingStructurePopupPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-dialog-popup']`)
            .find(`[test-field-pricing-structure-name]`)
            .clear({force: true})
            .type(name, {force: true});
        return this;
    }

    editDescription(description: string): EditPricingStructurePopupPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-dialog-popup']`)
            .find(`[test-field-pricing-structure-description]`)
            .clear({force: true})
            .type(description, {force: true});
        return this;
    }

    selectView(viewName: string): EditPricingStructurePopupPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-dialog-popup']`)
            .find(`[test-mat-select-pricing-structure-view] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-pricing-structure-view='${viewName}']`)
            .click({force: true});
        return this;
    }

    clickOk(): PricingPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-dialog-popup']`)
            .find(`[test-button-ok]`)
            .click({force: true});
        return new PricingPage();
    }

    clickCancel(): PricingPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-dialog-popup']`)
            .find(`[test-button-cancel]`)
            .click({force: true});
        return new PricingPage();
    }

}
