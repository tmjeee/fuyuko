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



}
