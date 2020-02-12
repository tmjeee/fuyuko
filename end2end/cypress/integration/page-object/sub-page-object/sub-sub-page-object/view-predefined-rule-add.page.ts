import {AbstractViewPredefinedRulePage} from "./abstract-view-predefined-rule.page";

export class ViewPredefinedRuleAddPage extends AbstractViewPredefinedRulePage {


    validateTitle(): ViewPredefinedRuleAddPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-add-rule');
        return this;
    }

    visit(): ViewPredefinedRuleAddPage {
        cy.visit(`/view-gen-layout/(add-rule//help:view-help)`);
        return this;
    }

}
