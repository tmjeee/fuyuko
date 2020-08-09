import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";
import {ViewValidationDetailsPage} from "../view-validation-details.page";


export class ViewValidationAttributePopupPage extends AbstractViewDataAttributePopupPage {

    constructor(private validationName: string, public PAGE_NAME: string) {
        super(PAGE_NAME);
    }

    clickOk(): ViewValidationDetailsPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-done]`)
            .click({force: true});
        // cy.wait(100);
        return new ViewValidationDetailsPage(this.validationName).waitForReady();
    }

    clickCancel(): ViewValidationDetailsPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-cancel]`)
            .click({force: true});
        cy.wait(100);
        return new ViewValidationDetailsPage(this.validationName);
    }
}
