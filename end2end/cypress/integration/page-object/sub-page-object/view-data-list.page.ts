import {ActualPage} from "../actual.page";

export class ViewDataListPage implements ActualPage<ViewDataListPage> {

    validateTitle(): ViewDataListPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-list');
        return this;
    }

    visit(): ViewDataListPage {
        cy.visit(`/view-gen-layout/(data-list//help:view-help)`);
        return this;
    }

}
