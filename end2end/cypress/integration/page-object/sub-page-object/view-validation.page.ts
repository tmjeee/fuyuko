import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewValidationPage implements ActualPage<ViewValidationPage> {

    validateTitle(): ViewValidationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-validations');
        return this;
    }

    visit(): ViewValidationPage {
        cy.visit(`/view-gen-layout/(validation//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewValidationPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewValidationPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
