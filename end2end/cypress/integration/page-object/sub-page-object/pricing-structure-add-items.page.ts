import {PricingPage} from "../pricing.page";
import {ActualPage} from "../actual.page";
import * as util from "../../util/util";


export class PricingStructureAddItemsPage implements ActualPage<PricingStructureAddItemsPage>{

    constructor(private pricingStructureId: number) {
    }


    visit(): PricingStructureAddItemsPage {
        cy.visit(`/gen-layout/(pricing-structure/${this.pricingStructureId}/add-items//help:pricing-help)`);
        return this;
    }

    validateTitle(): PricingStructureAddItemsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'pricing-add-items');
        return this;
    }

    verifyErrorMessageExists(): PricingStructureAddItemsPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): PricingStructureAddItemsPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    //////////////////

    verifyPopupTitle(): this {
        cy.get(`[test-popup-dialog-title='pricing-structure-edit-dialog-popup']`)
            .should('exist');
        return this;
    }

    editPricingStructureName(pricingStructureName: string): PricingStructureAddItemsPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-edit-dialog-popup']`)
            .find(`[test-field-pricing-structure-name]`)
            .clear({force: true})
            .type(pricingStructureName, {force: true});
        return this;
    }

    editPricingStructureDescription(pricingStructureDescription: string): PricingStructureAddItemsPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-edit-dialog-popup']`)
            .find(`[test-field-pricing-structure-description]`)
            .clear({force: true})
            .type(pricingStructureDescription, {force: true});
        return this;
    }

    clickOk(): PricingPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-edit-dialog-popup']`)
            .find(`[test-button-ok]`)
            .click({force: true})
        return new PricingPage();
    }

    clickCancel(): PricingPage {
        cy.get(`[test-popup-dialog-title='pricing-structure-edit-dialog-popup']`)
            .find(`[test-button-cancel]`)
            .click({force: true})
        return new PricingPage();
    }
}