import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";
import {ViewValidationDetailsPage} from "../view-validation-details.page";


export class ViewValidationItemPopupPage extends AbstractViewDataItemPopupPage {

    constructor(private validationName: string) {
        super();
    }

    clickOk(): ViewValidationDetailsPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-ok]`)
            .click({force: true})
            .wait(100);
        return new ViewValidationDetailsPage(this.validationName);
    }

    clickCancel(): ViewValidationDetailsPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-cancel]`)
            .click({force: true})
            .wait(100);
        return new ViewValidationDetailsPage(this.validationName);
    }
}
