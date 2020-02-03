import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewRuleDetailsPage implements ActualPage<ViewRuleDetailsPage> {

    constructor(private ruleId: number) {
    }

    validateTitle(): ViewRuleDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-edit-rule');
        return this;
    }

    visit(): ViewRuleDetailsPage {
        cy.visit(`/view-gen-layout/(rule/${this.ruleId}//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewRuleDetailsPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewRuleDetailsPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
