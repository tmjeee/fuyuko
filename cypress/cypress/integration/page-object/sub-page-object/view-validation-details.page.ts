import {AbstractPage} from "../abstract.page";
import {ActualPage} from "../actual.page";

export class ViewValidationDetailsPage extends AbstractPage implements ActualPage<ViewValidationDetailsPage> {

    constructor(private viewId: number, private validationId: number) {
        super();
    }

    validateTitle(): ViewValidationDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-validation-details');
        return this;
    }

    visit(): ViewValidationDetailsPage {
        cy.visit(`/view-gen-layout/(validation-details/view/${this.viewId}/validation/${this.validationId}//help:view-help)`);
        return this;
    }

}
