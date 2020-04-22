import {ActualPage} from "./actual.page";
import * as util from '../util/util';
import {EditPricingStructurePopupPage} from "./sub-page-object/edit-pricing-structure-popup.page";
import {EditPricingPopupPage} from "./sub-page-object/edit-pricing-popup.page";
import {CountryCurrencyUnits} from "../model/unit.model";


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
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): PricingPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    pricingTableReady(): PricingPage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]`));
        return this;
    }

    selectPricingStructure(viewName: string, pricingStructureName: string): PricingPage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]`)).then((_) => {
            cy.wrap(_)
                .find(`[test-mat-select-pricing-structure]`).first()
                .click({force: true});
        }).then((_) => {
            cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`).then((_) => {
                cy.wrap(_).click({force: true});
            });
        });
        return this;
    }

    verifyPricingStrucureHasItems(pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-pricing-structure-items-table='${pricingStructureName}']`)
            .should(`exist`);
        return this;
    }

    verifyNoPricingStructureTable(): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .should('not.exist');
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

    verifyPricingStructureExists(viewName: string, pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-mat-select-pricing-structure]`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`)
            .should('exist');
        return this;
    }

    verifyPricingStructureDoNotExist(viewName: string, pricingStructureName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-mat-select-pricing-structure]`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`)
            .should('not.exist');
        return this;
    }

    clickToExpandItem(pricingStructureName: string, itemName: string): PricingPage {
        cy.waitUntil(()=>cy.get(`[test-pricing-structure-table] [test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-expand='${itemName}']`)).then((_) => {
            const i = _.length;
            if (i > 0) { // expand button exists, click it to expand
                cy.get(`[test-pricing-structure-table]`)
                    .find(`[test-pricing-structure-items-table='${pricingStructureName}']`)
                    .find(`[test-table-row-expand='${itemName}']`)
                    .click({force: true})
            }
            return cy.get(`[test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-collapse='${itemName}']`).then((_) => {
                return new Cypress.Promise((res, rej) => {
                    res(_);
                });
            });
        });
        return this;
    }

    clickToCollapseItem(pricingStructureName: string, itemName: string): PricingPage {
        cy.get(`[test-pricing-structure-table]`).then((_) => {
            const i = _.find(`[test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-collapse='${itemName}']`).length;
            if (i > 0) { // expand button exists, click it to expand
                cy.get(`[test-pricing-structure-table]`)
                    .find(`[test-pricing-structure-items-table='${pricingStructureName}']`)
                    .find(`[test-table-row-collapse='${itemName}']`)
                    .click({force: true})
            }
            return cy.get(`[test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-expand='${itemName}']`).then((_) => {
                return new Cypress.Promise((res, rej) => {
                    res(_);
                });
            });
        });
        return this;
    }

    verifyPricingStructureItemHasPrice(pricingStructureName: string, itemName: string, price: number, unit: CountryCurrencyUnits): PricingPage {
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-pricing-structure-items-table='${pricingStructureName}']`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-table-column-price='${itemName}']`)
            .should('contain.text', price);
        cy.get(`[test-pricing-structure-table]`)
            .find(`[test-pricing-structure-items-table='${pricingStructureName}']`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-table-column-unit='${itemName}']`)
            .should('contain.text', unit);
        return this;
    }
}
