import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewAttributeDetailsPage implements ActualPage<ViewAttributeDetailsPage> {

    constructor(private attributeId: number) {
    }

    validateTitle(): ViewAttributeDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-edit-attribute');
        return this;
    }

    visit(): ViewAttributeDetailsPage {
        cy.visit(`/view-gen-layout/(attribute/${this.attributeId}//help:view-help)`);
        this.waitForReady();
        return this;
    }

    waitForReady(): ViewAttributeDetailsPage {
        util.waitUntilTestPageReady();
        cy.wait(2000);
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
