import {AbstractPage} from "../abstract.page";
import {ActualPage} from "../actual.page";

export class ViewRuleDetailsPage extends AbstractPage implements ActualPage<ViewRuleDetailsPage> {

    constructor(private ruleId: number) {
        super();
    }

    validateTitle(): ViewRuleDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-edit-rule');
        return this;
    }

    visit(): ViewRuleDetailsPage {
        cy.visit(`/view-gen-layout/(rule/${this.ruleId}//help:view-help)`);
        return this;
    }

}
