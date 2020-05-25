import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

const PAGE_NAME = 'partner-list';
export class PartnerListPage implements ActualPage<PartnerListPage> {

    validateTitle(): PartnerListPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): PartnerListPage {
        cy.visit('/partner-layout/(list//help:partner-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): PartnerListPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): PartnerListPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): PartnerListPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    //////

    selectPricingStructure(viewName: string, pricingStructureName: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-mat-select-pricing-structure]`)).first()
            .click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`))
            .click({force: true});
        cy.wait(100);
        return this;
    }

    selectItemInList(itemName: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-panel-header='${itemName}']`))
            .click({force: true})
        return this;
    }

    verifyItemExpanded(itemName: string, b: boolean): PartnerListPage {
        cy.wait(100).waitUntil(() => cy.get(`[test-partner-data-list]
            [test-panel-content='${itemName}']`))
            .should(b ? 'be.visible' : 'not.be.visible');
        return this;
    }

    verifyItemName(itemName: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-panel-content='${itemName}']
            [test-item-name='${itemName}']`))
            .should('exist');
        return this;
    }

    verifyItemPrice(itemName: string, price: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-panel-content='${itemName}']
            [test-item-price='${itemName}']`))
            .should('contain.text', price);
        return this;
    }

    verifyItemAttributeValue(itemName: string, attributeName: string, value: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-panel-content='${itemName}']
            [test-item-attribute='${itemName}']`))
            .should('contain.text', value)
        return this;
    }

    clickNextImage(itemName: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-panel-content='${itemName}']
            [test-button-next-image]`))
            .click({force: true});
        return this;
    }

    clickPreviousImage(itemName: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-panel-content='${itemName}']
            [test-button-previous-image]`))
            .click({force: true});
        return this;
    }

    showItemAttributeSideMenu(itemName: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-link-open-attribute-menu='${itemName}']`))
            .click({force: true});
        return this;
    }

    verifyItemSideMenuOpened(b: boolean): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-side-nav]`))
            .should(b ? 'be.visible' : 'not.be.visible');
        return this;
    }

    verifyItemSideMenuItemName(itemName: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-partner-item-info-table]
            [test-info-name='Name']`))
            .should('contain.text', itemName)
        return this;
    }

    verifyItemSideMenuItemPrice(price: string): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-partner-item-info-table]
            [test-info-name='Price']`))
            .should('contain.text', price);
        return this;
    }

    verifyItemSideMenuAttributeValue(attributeName: string, values: string[]): PartnerListPage {
        cy.wrap(values).each((e, i, a) => {
            return cy.waitUntil(() => cy.get(`[test-partner-data-list]
                [test-partner-attribute-table]
                [test-cell-attribute='${attributeName}']`))
                .should('contain.text', values[i])
            ;
        });
        return this;
    }

    closeItemAttributeSideMenu(): PartnerListPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-list]
            [test-icon-close-side-menu]`))
            .click({force: true})
        return this;
    }
}
