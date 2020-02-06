import {AbstractViewRulePage} from "./abstract-view-rule.page";

export class ViewRuleEditPage extends AbstractViewRulePage {

    validateTitle(): ViewRuleEditPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-edit-rule');
        return this;
    }

    visit(ruleId: number): ViewRuleEditPage {
        cy.visit(`/view-gen-layout/(edit-rule/${ruleId}//help:view-help)`);
        return this;
    }

}
