import {ActualPage} from "./actual.page";


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
}
