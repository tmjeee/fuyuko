import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewRulePage implements ActualPage<ViewRulePage> {

    validateTitle(): ViewRulePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-rules');
        return this;
    }

    visit(): ViewRulePage {
        cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewRulePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewRulePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
