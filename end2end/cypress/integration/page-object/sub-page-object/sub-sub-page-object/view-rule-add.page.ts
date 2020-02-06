import {AbstractViewRulePage} from "./abstract-view-rule.page";

export class ViewRuleAddPage extends AbstractViewRulePage {


    validateTitle(): ViewRuleAddPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-add-rule');
        return this;
    }

    visit(): ViewRuleAddPage {
        cy.visit(`/view-gen-layout/(add-rule//help:view-help)`);
        return this;
    }

}
