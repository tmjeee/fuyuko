import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

const PAGE_NAME = 'partner-table';
export class PartnerTablePage implements ActualPage<PartnerTablePage> {

    validateTitle(): PartnerTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): PartnerTablePage {
        cy.visit('/partner-layout/(table//help:partner-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): PartnerTablePage {
        util.waitUntilTestPageReady(PAGE_NAME);
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
        cy.waitUntil(() => cy.get(`[test-mat-select-pricing-structure]`)).first()
            .click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`)).as('testMatOption');
        cy.get('@testMatOption').then((_) => {
            cy.wrap(_).click({force: true})
        });
        cy.waitUntil(() => cy.get(`[test-partner-data-table]`)).then((_) => {
            return new Cypress.Promise((res, rej) => {
                res(_);
            });
        });
        return this;
    }

    expandItem(itemName: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-page-title]`)).then((_) => {
            const length = _.find(`[test-table-partner-item] [test-icon-expand-item='${itemName}']`).length
            cy.log(`test-icon-expand-item=${itemName} length = ${length}`);
            if (length > 0) { // can be expanded
                cy.waitUntil(() => cy.get(`[test-table-partner-item]
                    [test-icon-expand-item='${itemName}']`))
                    .click({force: true});
            }
            return cy.waitUntil(() => cy.get(`[test-table-partner-item] [test-icon-collapse-item='${itemName}`)).then((_) => {
                return new Cypress.Promise((res, rej) => res(_));
            });
        });
        return this;
    }

    collapseItem(itemName: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-page-title]`)).then((_) => {
            const length = _.find(`[test-table-partner-item] [test-icon-collapse-item='${itemName}']`).length
            if (length > 0) { // can be collapsed
                cy.waitUntil(() => cy.get(`[test-table-partner-item]
                    [test-icon-collapse-item='${itemName}']`))
                    .click({force: true});
            }
            cy.waitUntil(() => cy.get(`[test-table-partner-item] [test-icon-expand-item='${itemName}`)).then((_) => {
                return new Cypress.Promise((res, rej) => res(_));
            });
        });
        return this;
    }

    verifyItemVisible(itemName: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-table-partner-item]
            [test-row-item='${itemName}']`))
            .should('be.visible');
        return this;
    }

    verifyItemNotVisible(itemName: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-table-partner-item]
            [test-row-item='${itemName}']`))
            .should('not.be.visible');
        return this;
    }

    clickOnShowAttributeIcon(itemName: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-table-partner-item]
            [test-icon-more-attributes='${itemName}']`))
            .click({force: true});
        cy.waitUntil(() => cy.get(`[test-side-nav] div.partner-item-info-table`)).then((_) => {
            return new Cypress.Promise((res, rej) => {
                res(_);
            });
        });
        return this;
    }

    verifyAttributeSideMenuVisible(): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-partner-data-table] 
            [test-side-nav] div.partner-item-info-table`))
            .scrollIntoView()
            .should('be.visible');
        return this;
    }

    verifyAttributeSideMenuItemName(itemName: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-partner-data-table] 
            [test-side-nav]
            [test-table-partner-item-info]
            [test-info-name='Name']`))
            .should('contains.text', itemName);
        return this;
    }

    verifyAttributeSideNenuItemPrice(price: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-partner-data-table]
            [test-side-nav]
            [test-table-partner-item-info]
            [test-info-name='Price']`))
            .should('contains.text', price);
        return this;

    }

    verifyAttributeSideMenuAttributeValue(attributeName: string, values: string[]): PartnerTablePage {
        cy.wrap(values).each((e, i, a) => {
            return cy.waitUntil(() => cy.get(`[test-partner-data-table]
                [test-side-nav]
                [test-table-partner-attributes]
                [test-cell-attribute='${attributeName}']`))
                .then((_) => {
                    return cy.wrap(_).should('contain.text', values[i]);
                })
        })
        return this;
    }

    verifyItemName(itemName: string, name: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-partner-data-table]
            [test-row-item='${itemName}']
            [test-table-cell='name']`))
            .should('contain.text', name);
        return this;
    }

    verifyItemPrice(itemName: string, price: string): PartnerTablePage {
        cy.waitUntil(() => cy.get(`[test-partner-data-table]
            [test-row-item='${itemName}']
            [test-table-cell='price']`))
            .should('contain.text', price);
        return this;
    }

    verifyItemAttributeValue(itemName: string, attributeName: string, values: string[]): PartnerTablePage {
        cy.wrap(values).each((e, i, a) => {
            return cy.waitUntil(() => cy.get(`[test-partner-data-table]
                [test-row-item='${itemName}']
                [test-table-cell='${attributeName}']`))
                .should('contain.text', values[i]);
        });
        return this;
    }
}
