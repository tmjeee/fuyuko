import {ActualPage} from "./actual.page";
import * as util from '../util/util';


export class BulkEditPage implements ActualPage<BulkEditPage> {

    constructor() { }

    visit(): BulkEditPage {
        cy.visit('/gen-layout/(bulk-edit//help:bulk-edit-help)');
        return this;
    }

    validateTitle(): BulkEditPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'bulk-edit');
        return this;
    }

    verifyErrorMessageExists(): BulkEditPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): BulkEditPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    ////////////////////

    selectView(viewName: string): BulkEditPage {
        cy.get(`[test-page-title='bulk-edit']`)
            .find(`[test-mat-select-current-view] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-current-view='${viewName}']`)
            .click({force: true});
        return this;
    }

    verifySelectedView(viewName: string): BulkEditPage {
        cy.get(`[test-page-title='bulk-edit']`)
            .find(`[test-bulk-edit-wizard='${viewName}']`)
            .should('exist');
        return this;
    }
}
