import {AbstractPage} from "../abstract.page";
import {ActualPage} from "../actual.page";

export class ViewDataTablePage extends AbstractPage implements ActualPage<ViewDataTablePage> {

    validateTitle(): ViewDataTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-table');
        return this;
    }

    visit(): ViewDataTablePage {
        cy.visit(`/view-gen-layout/(data-tabular//help:view-help)`);
        return this;
    }

}
