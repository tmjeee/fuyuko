import {ActualPage} from "./actual.page";
import * as util from '../util/util';
import {EditPricingStructurePopupPage} from "./sub-page-object/edit-pricing-structure-popup.page";
import {EditPricingPopupPage} from "./sub-page-object/edit-pricing-popup.page";


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

    clickDeletePricingStructure(pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-button-delete-pricing-structure='${pricingStructureName}']`)
            .click({force: true});
        return this;
    }

    clickEditPricingStructure(pricingStructureName: string): EditPricingStructurePopupPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-button-edit-pricing-structure='${pricingStructureName}']`)
            .click({force: true});
        return new EditPricingStructurePopupPage();
    }

    clickEditItemPricing(pricingStructureName: string, itemName: string): EditPricingPopupPage {
        cy.get(`[test-pricing-structure-items-table='${pricingStructureName}']`)
            .find(`[test-button-edit-pricing='${itemName}']`)
            .click({force: true});
        return new EditPricingPopupPage();
    }


    clickAddNewPricingStructure(): EditPricingStructurePopupPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-button-new-pricing-structure]`)
            .click({force: true});
        return new EditPricingStructurePopupPage();
    }

    verifyPricingStructureExists(pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-mat-select-pricing-structure] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-pricing-structure='${pricingStructureName}']`)
            .should('not.exist');
        return this;
    }

    verifyPricingStructureDoNotExist(pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-mat-select-pricing-structure] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-pricing-structure='${pricingStructureName}']`)
            .should('exist');
        return this;
    }
}
