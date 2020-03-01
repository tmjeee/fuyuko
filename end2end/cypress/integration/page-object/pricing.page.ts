import {ActualPage} from "./actual.page";
import * as util from '../util/util';
import {PricingStructureAddItemsPage} from "./sub-page-object/pricing-structure-add-items.page";


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

    verifyErrorMessageExists(): PricingPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): PricingPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    selectPricingStructure(pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-mat-select-pricing-structure] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-pricing-structure='${pricingStructureName}']`)
            .click({force: true});
        return this;
    }

    verifyPricingStrucureHasItems(pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-pricing-structure-items-table='${pricingStructureName}']`)
            .should(`exist`);
        return this;
    }

    verifyPricingStructureHasNoItems(pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-pricing-structure-items-table='${pricingStructureName}']`)
            .should(`not.exist`);
        return this;
    }

    clickAddNewPricingStructure(pricingStructureId: number): PricingStructureAddItemsPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-button-new-pricing-structure]`)
            .click({force: true})
        return new PricingStructureAddItemsPage(pricingStructureId);
    }
}
