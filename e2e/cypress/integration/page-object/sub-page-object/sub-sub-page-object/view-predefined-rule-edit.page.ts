import {AbstractViewPredefinedRulePage} from "./abstract-view-predefined-rule.page";

export class ViewPredefinedRuleEditPage extends AbstractViewPredefinedRulePage {

    validateTitle(): ViewPredefinedRuleEditPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-edit-rule');
        return this;
    }

    visit(ruleId: number): ViewPredefinedRuleEditPage {
        cy.visit(`/view-layout/(edit-rule/${ruleId}//help:view-help)`);
        return this;
    }

}
