import {ActualPage} from "../actual.page";

export class ViewRulePage implements ActualPage<ViewRulePage> {

    validateTitle(): ViewRulePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-rules');
        return this;
    }

    visit(): ViewRulePage {
        cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        return this;
    }

}
