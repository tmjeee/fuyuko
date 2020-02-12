import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewDataTablePage implements ActualPage<ViewDataTablePage> {

    validateTitle(): ViewDataTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-table');
        return this;
    }

    visit(): ViewDataTablePage {
        cy.visit(`/view-gen-layout/(data-tabular//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataTablePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataTablePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    doBasicSearch(search: string): ViewDataTablePage {
        cy.get(`[test-mat-tab-basic-search]`).click({force: true});
        cy.get(`[test-field-data-table-search]`)
            .clear({force: true})
            .type(`${search}{enter}`, {force: true})
        return this;
    }

    verifyDataTableResultSize(size: number): ViewDataTablePage {
        cy.get(`[test-data-table-row]`).should('have.length.gte', size);
        return this;
    }

    verifyDataTableHasItem(itemName: string, b: boolean): ViewDataTablePage {
        cy.get(`[test-data-table-row='${itemName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }

    openFilterBox(): ViewDataTablePage {
        cy.get('document').then((e) => {
            if (e.find(`[test-filtering-container]`).length <= 0) {
                // not opened yet
                cy.get(`[test-button-filter-items]`).click({force: true});
            }
        });
        return this;
    }

    closeFilterBox(): ViewDataTablePage {
        cy.get('document').then((e) => {
            if (e.find(`[test-filtering-container]`).length > 0) {
                // not opened yet
                cy.get(`[test-button-filter-items]`).click({force: true});
            }
        });
       return this;
    }

    verifyFilterBoxOpen(b: boolean): ViewDataTablePage {
        cy.get(`[test-filtering-container]`).should(b ? 'exist' : 'not.exist');
        return this;
    }


    checkFilterCheckbox(attributeName: string, b: boolean): ViewDataTablePage {
        cy.wrap(document).then((e) => {
            const c = e.find(`[test-checkbox-item-filtering='${attributeName}'].mat-checkbox-checked `).length;
            if (c && !b) { // already checked but we want to uncheck it
                cy.get(`[test-checkbox-item-filtering='${attributeName}']`).click({force: true});
            } if (!c && b) { // already unchecked but we want to check it
                cy.get(`[test-checkbox-item-filtering='${attributeName}']`).click({force: true});
            }
        });
        return this;
    }

    verifyAttributeCellDoNotExists(attributeName: string, b: boolean) : ViewDataTablePage {
        cy.get(`[test-data-table-attribute='${attributeName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }

    moveAttributeFilterOrderUp(attributeName: string): ViewDataTablePage {
        cy.wrap(document).then((e) => {
            const l = e.find(`[test-button-item-filtering-up]`).length;
            if (l) {
               cy.get(`[test-button-item-filtering-up]`).click({force: true});
            }
        })
        return this;
    }

    moveAttributeFilterOrderDown(attributeName: string): ViewDataTablePage {
        cy.wrap(document).then((e) => {
            const l = e.find(`[test-button-item-filtering-down]`).length;
            if (l) {
                cy.get(`[test-button-item-filtering-down]`).click({force: true});
            }
        })
        return this;
    }

    verifyAttributeCellOrder(attributeName: string, order: number): ViewDataTablePage {
        cy.get(`[test-data-table-attribute='${attributeName}']`)
            .should('have.attr', `test-data-table-attribute-index`, order);
        return this;
    }

}
