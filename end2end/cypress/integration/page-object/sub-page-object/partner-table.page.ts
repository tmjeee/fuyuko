import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class PartnerTablePage implements ActualPage<PartnerTablePage> {

    validateTitle(): PartnerTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'partner-table');
        return this;
    }

    visit(): PartnerTablePage {
        cy.visit('/partner-layout/(table//help:partner-help)');
        return this;
    }

    verifyErrorMessageExists(): PartnerTablePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): PartnerTablePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    /////////////////

    selectPricingStructure(viewName: string, pricingStructureName: string): PartnerTablePage {
        cy.get(`[test-mat-select-pricing-structure] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`)
            .click({force: true});
        cy.wait(1000);
        return this;
    }

    expandItem(itemName: string): PartnerTablePage {
        cy.get(`[test-page-title]`).then((_) => {
            const length = _.find(`[test-table-partner-item] [test-icon-expand-item='${itemName}']`).length
            if (length > 0) { // can be expanded
                return cy.get(`[test-table-partner-item]`)
                    .find(`[test-icon-expand-item='${itemName}']`)
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    collapseItem(itemName: string): PartnerTablePage {
        cy.get(`[test-page-title]`).then((_) => {
            const length = _.find(`[test-table-partner-item] [test-icon-collapse-item='${itemName}']`).length
            if (length > 0) { // can be collapsed
                return cy.get(`[test-table-partner-item]`)
                    .find(`[test-icon-collapse-item='${itemName}']`)
                    .click({force: true});
            }
            return cy.wait(1000);
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
            .click({force: true})
            .wait(100);
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
