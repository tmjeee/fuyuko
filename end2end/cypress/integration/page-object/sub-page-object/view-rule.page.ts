import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewPredefinedRulePage} from "./sub-sub-page-object/view-predefine-rule.page";
import {ViewCustomRulePage} from "./sub-sub-page-object/view-custom-rule.page";

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
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewRulePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    selectCustomTab(): ViewCustomRulePage {
        cy.get(`[test-tab='custom']`).click();
        return new ViewCustomRulePage();
    }

    selectPredefinedTab(): ViewPredefinedRulePage {
        cy.get(`[test-tab='predefined']`).click();
        return new ViewPredefinedRulePage();
    }

}
