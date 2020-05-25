import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewPredefinedRulePage} from "./sub-sub-page-object/view-predefine-rule.page";
import {ViewCustomRulePage} from "./sub-sub-page-object/view-custom-rule.page";

const PAGE_NAME: string = 'view-rules';

export class ViewRulePage implements ActualPage<ViewRulePage> {

    selectGlobalView(viewName: string): ViewRulePage {
        cy.waitUntil(() => cy.get(`[test-mat-select-global-view]`)).first().click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-global-view='${viewName}']`)).click({force: true})
            .wait(1000);
        cy.waitUntil(() => cy.get(`[test-page-ready='true']`));
        return this;
    }

    validateTitle(): ViewRulePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): ViewRulePage {
        cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        this.waitForReady();
        return this;
    }

    waitForReady(): ViewRulePage {
        util.waitUntilTestPageReady(PAGE_NAME);
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
        cy.get(`[test-tab='custom']`).click({force: true});
        return new ViewCustomRulePage();
    }

    selectPredefinedTab(): ViewPredefinedRulePage {
        cy.get(`[test-tab='predefined']`).click({force: true});
        return new ViewPredefinedRulePage();
    }

}
