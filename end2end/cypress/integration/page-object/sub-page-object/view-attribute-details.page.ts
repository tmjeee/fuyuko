import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

const PAGE_NAME = 'view-edit-attribute';
export class ViewAttributeDetailsPage implements ActualPage<ViewAttributeDetailsPage> {

    constructor(private attributeId: number) {
    }

    selectGlobalView(viewName: string): ViewAttributeDetailsPage {
        cy.waitUntil(() => cy.get(`[test-mat-select-global-view]`)).first().click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-global-view='${viewName}']`)).click({force: true})
            .wait(1000);
        cy.waitUntil(() => cy.get(`[test-page-ready='true']`));
        return this;
    }

    validateTitle(): ViewAttributeDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): ViewAttributeDetailsPage {
        cy.visit(`/view-gen-layout/(attribute/${this.attributeId}//help:view-help)`);
        this.waitForReady();
        return this;
    }

    waitForReady(): ViewAttributeDetailsPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): ViewAttributeDetailsPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewAttributeDetailsPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }
}
