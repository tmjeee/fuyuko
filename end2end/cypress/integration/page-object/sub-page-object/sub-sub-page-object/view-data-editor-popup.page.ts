import {View} from "../../../model/view.model";


export class ViewDataEditorPopupPage {

    verifyPopupTitle(): ViewDataEditorPopupPage {
        cy.get(`[test-popup-dialog-title]`)
            .should('have.attr', 'test-popup-dialog-title', 'data-editor-dialog-popup');
        return this;
    }

    editStringValue(): ViewDataEditorPopupPage {
        return this;
    }

    editTextValue(): ViewDataEditorPopupPage {
        return this;
    }

    clickCancel(): ViewDataEditorPopupPage {
        cy.get(`[test-button-cancel]`).click({force: true});
        return this;
    }

    clickDone(): ViewDataEditorPopupPage {
        cy.get(`[test-button-done]`).click({force: true});
        return this;
    }
}
