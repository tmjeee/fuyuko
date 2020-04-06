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


    expandItem(itemName: string): PartnerTablePage {
        cy.get(`[test-page-title]`).then((_) => {
            const length = _.filter(`[test-table-partner-item] [test-icon-expand-item='${itemName}']`).length
            if (length < 0) { // not already expanded
                cy.get(`[test-table-partner-item]`)
                    .find(`[test-icon-expand-item='${itemName}']`)
                    .click({force: true});
            }
        });
        return this;
    }

    collapseItem(itemName: string): PartnerTablePage {
        cy.get(`[test-page-title]`).then((_) => {
            const length = _.filter(`[test-table-partner-item] [test-icon-expand-item='${itemName}']`).length
            if (length > 0) { // already expanded
                cy.get(`[test-table-partner-item]`)
                    .find(`[test-icon-expand-item='${itemName}']`)
                    .click({force: true});
            }
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
        return this;
    }

    verifyAttributeSideMenuVisible(): PartnerTablePage {
        cy.get(`[test-partner-data-table]`) //
            .find(`.side-nav`)
            .should('be.visible');
        return this;
    }

    verifyAttributeSideMenuItemName(itemName: string): PartnerTablePage {
        cy.get(`[test-partner-data-table]`) //
            .find(`.side-nav`)
            .find(`[test-table-partner-item-info]`)
            .find(`[test-info-name='Name']`)
            .should('contains.text', itemName);
        return this;
    }

    verifyAttributeSideNenuItemPrice(price: string) {
        cy.get(`[test-partner-data-table]`) //
            .find(`.side-nav`)
            .find(`[test-table-partner-item-info]`)
            .find(`[test-info-name='Price']`)
            .should('contains.text', price);
        return this;

    }
}
