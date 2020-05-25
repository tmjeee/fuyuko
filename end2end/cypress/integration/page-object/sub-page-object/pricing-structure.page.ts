import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {EditPricingStructurePopupPage} from "./edit-pricing-structure-popup.page";
import {EditPricingPopupPage} from "./edit-pricing-popup.page";
import {CountryCurrencyUnits} from "../../model/unit.model";

const PAGE_NAME = 'pricing-structure';

export class PricingStructurePage implements ActualPage<PricingStructurePage> {

    visit(): PricingStructurePage {
        cy.visit('/price-layout/(pricing-structure//help:pricing-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): PricingStructurePage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    validateTitle(): PricingStructurePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): PricingStructurePage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): PricingStructurePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }


    //////////////////////////////////////////////

    pricingTableReady(): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]`));
        return this;
    }

    selectPricingStructure(viewName: string, pricingStructureName: string): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]`)).then((_) => {
            cy.wrap(_)
                .find(`[test-mat-select-pricing-structure]`).first()
                .click({force: true});
        }).then((_) => {
            cy.waitUntil(() => cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`))
                .then((_) => {
                    cy.wrap(_).click({force: true});
                });
        });
        return this;
    }

    verifyPricingStrucureHasItems(pricingStructureName: string): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-pricing-structure-items-table='${pricingStructureName}']`))
            .should(`exist`);
        return this;
    }

    verifyNoPricingStructureTable(): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]`))
            .should('not.exist');
        return this;
    }

    verifyPricingStructureHasNoItems(pricingStructureName: string): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-pricing-structure-items-table='${pricingStructureName}']`))
            .should(`not.exist`);
        return this;
    }

    clickDeletePricingStructure(pricingStructureName: string): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-button-delete-pricing-structure='${pricingStructureName}']`))
            .click({force: true});
        return this;
    }

    clickEditPricingStructure(pricingStructureName: string): EditPricingStructurePopupPage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-button-edit-pricing-structure='${pricingStructureName}']`))
            .click({force: true});
        return new EditPricingStructurePopupPage();
    }

    clickEditItemPricing(pricingStructureName: string, itemName: string): EditPricingPopupPage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-items-table='${pricingStructureName}']
            [test-button-edit-pricing='${itemName}']`))
            .click({force: true});
        return new EditPricingPopupPage();
    }


    clickAddNewPricingStructure(): EditPricingStructurePopupPage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-button-new-pricing-structure]`))
            .click({force: true});
        return new EditPricingStructurePopupPage();
    }

    verifyPricingStructureExists(viewName: string, pricingStructureName: string): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-mat-select-pricing-structure]`)).first()
            .click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`))
            .should('exist');
        return this;
    }

    verifyPricingStructureDoNotExist(viewName: string, pricingStructureName: string): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-mat-select-pricing-structure]`)).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`)
            .should('not.exist');
        return this;
    }

    clickToExpandItem(pricingStructureName: string, itemName: string): PricingStructurePage {
        cy.waitUntil(()=>cy.get(`[test-pricing-structure-table] [test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-expand='${itemName}']`)).then((_) => {
            const i = _.length;
            if (i > 0) { // expand button exists, click it to expand
                cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
                    [test-pricing-structure-items-table='${pricingStructureName}']
                    [test-table-row-expand='${itemName}']`))
                    .click({force: true})
            }
            return cy.waitUntil(() => cy.get(`[test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-collapse='${itemName}']`)).then((_) => {
                return new Cypress.Promise((res, rej) => {
                    res(_);
                });
            });
        });
        return this;
    }

    clickToCollapseItem(pricingStructureName: string, itemName: string): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]`)).then((_) => {
            const i = _.find(`[test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-collapse='${itemName}']`).length;
            if (i > 0) { // expand button exists, click it to expand
                cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
                    [test-pricing-structure-items-table='${pricingStructureName}']
                    [test-table-row-collapse='${itemName}']`))
                    .click({force: true})
            }
            return cy.waitUntil(() => cy.get(`[test-pricing-structure-items-table='${pricingStructureName}'] [test-table-row-expand='${itemName}']`)).then((_) => {
                return new Cypress.Promise((res, rej) => {
                    res(_);
                });
            });
        });
        return this;
    }

    verifyPricingStructureItemHasPrice(pricingStructureName: string, itemName: string, price: number, unit: CountryCurrencyUnits): PricingStructurePage {
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-pricing-structure-items-table='${pricingStructureName}']
            [test-table-row-item='${itemName}']
            [test-table-column-price='${itemName}']`))
            .should('contain.text', price);
        cy.waitUntil(() => cy.get(`[test-pricing-structure-table]
            [test-pricing-structure-items-table='${pricingStructureName}']
            [test-table-row-item='${itemName}']
            [test-table-column-unit='${itemName}']`))
            .should('contain.text', unit);
        return this;
    }

}