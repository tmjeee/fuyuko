import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewValidationPage} from "./view-validation.page";

export class ViewValidationDetailsPage implements ActualPage<ViewValidationDetailsPage> {

    constructor(private validationName: string){ }

    validateTitle(): ViewValidationDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-validation-details');
        return this;
    }

    visit(): ViewValidationDetailsPage {
        // cy.visit(`/view-gen-layout/(validation-details/view/${this.viewId}/validation/${this.validationId}//help:view-help)`);
        new ViewValidationPage().clickOnValidationDetails(this.validationName);
        return this;
    }

    verifyErrorMessageExists(): ViewValidationDetailsPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewValidationDetailsPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
