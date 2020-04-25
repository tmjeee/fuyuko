import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class PartnerTablePage implements ActualPage<PartnerTablePage> {

    validateTitle(): PartnerTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'partner-table');
        return this;
    }

    visit(): PartnerTablePage {
        cy.visit('/partner-layout/(table//help:partner-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): PartnerTablePage {
        util.waitUntilTestPageReady();
        cy.wait(2000);
        return this;
    }

    verifyErrorMessageExists(): PartnerTablePage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): PartnerTablePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    /////////////////

    selectPricingStructure(viewName: string, pricingStructureName: string): PartnerTablePage {
        cy.get(`[test-mat-select-pricing-structure]`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`).as('testMatOption');
        cy.get('@testMatOption').then((_) => {
            cy.wrap(_).click({force: true})
        });
        cy.get(`[test-partner-data-table]`).then((_) => {
            return new Cypress.Promise((res, rej) => {
                res(_);
            });
        });
        return this;
    }

    expandItem(itemName: string): PartnerTablePage {
        cy.get(`[test-page-title]`).then((_) => {
            const length = _.find(`[test-table-partner-item] [test-icon-expand-item='${itemName}']`).length
            cy.log(`test-icon-expand-item=${itemName} length = ${length}`);
            if (length > 0) { // can be expanded
                cy.get(`[test-table-partner-item]`)
                    .find(`[test-icon-expand-item='${itemName}']`)
                    .click({force: true});
            }
            return cy.get(`[test-table-partner-item] [test-icon-collapse-item='${itemName}`).then((_) => {
                return new Cypress.Promise((res, rej) => res(_));
            });
        });
        return this;
    }

    collapseItem(itemName: string): PartnerTablePage {
        cy.get(`[test-page-title]`).then((_) => {
            const length = _.find(`[test-table-partner-item] [test-icon-collapse-item='${itemName}']`).length
            if (length > 0) { // can be collapsed
                cy.get(`[test-table-partner-item]`)
                    .find(`[test-icon-collapse-item='${itemName}']`)
                    .click({force: true});
            }
            cy.get(`[test-table-partner-item] [test-icon-expand-item='${itemName}`).then((_) => {
                return new Cypress.Promise((res, rej) => res(_));
            });
        });
        return this;
    }

    verifyItemVisible(itemName: string): PartnerTablePage {
        cy.get(`[test-table-partner-item]`)
            .find(`[test-row-item='${itemName}']`)
            .should('be.visible');
        return this;
    }

    verifyItemNotVisible(itemName: string): PartnerTablePage {
        cy.get(`[test-table-partner-item]`)
            .find(`[test-row-item='${itemName}']`)
            .should('not.be.visible');
        return this;
    }

    clickOnShowAttributeIcon(itemName: string): PartnerTablePage {
        cy.get(`[test-table-partner-item]`)
            .find(`[test-icon-more-attributes='${itemName}']`)
            .click({force: true});
        cy.get(`[test-side-nav] div.partner-item-info-table`).then((_) => {
            return new Cypress.Promise((res, rej) => {
                res(_);
            });
        });
        return this;
    }

    verifyAttributeSideMenuVisible(): PartnerTablePage {
        cy.get(`[test-partner-data-table]`) //
            .find(`[test-side-nav] div.partner-item-info-table`)
            .scrollIntoView()
            .should('be.visible');
        return this;
    }

    verifyAttributeSideMenuItemName(itemName: string): PartnerTablePage {
        cy.get(`[test-partner-data-table]`) //
            .find(`[test-side-nav]`)
            .find(`[test-table-partner-item-info]`)
            .find(`[test-info-name='Name']`)
            .should('contains.text', itemName);
        return this;
    }

    verifyAttributeSideNenuItemPrice(price: string): PartnerTablePage {
        cy.get(`[test-partner-data-table]`) //
            .find(`[test-side-nav]`)
            .find(`[test-table-partner-item-info]`)
            .find(`[test-info-name='Price']`)
            .should('contains.text', price);
        return this;

    }

    verifyAttributeSideMenuAttributeValue(attributeName: string, values: string[]): PartnerTablePage {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-partner-data-table]`) //
                .find(`[test-side-nav]`)
                .find(`[test-table-partner-attributes]`)
                .find(`[test-cell-attribute='${attributeName}']`)
                .then((_) => {
                    return cy.wrap(_).should('contain.text', values[i]);
                })
        })
        return this;
    }

    verifyItemName(itemName: string, name: string): PartnerTablePage {
        cy.get(`[test-partner-data-table]`) //
            .find(`[test-row-item='${itemName}']`)
            .find(`[test-table-cell='name']`)
            .should('contain.text', name);
        return this;
    }

    verifyItemPrice(itemName: string, price: string): PartnerTablePage {
        cy.get(`[test-partner-data-table]`) //
            .find(`[test-row-item='${itemName}']`)
            .find(`[test-table-cell='price']`)
            .should('contain.text', price);
        return this;
    }

    verifyItemAttributeValue(itemName: string, attributeName: string, values: string[]): PartnerTablePage {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-partner-data-table]`) //
                .find(`[test-row-item='${itemName}']`)
                .find(`[test-table-cell='${attributeName}']`)
                .should('contain.text', values[i]);
        });
        return this;
    }
}
