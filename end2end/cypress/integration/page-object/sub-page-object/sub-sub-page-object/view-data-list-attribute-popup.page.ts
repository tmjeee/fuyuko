import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";
import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailEditPopupPage} from "./view-data-thumbnail-edit-popup.page";
import {ViewDataListEditPopupPage} from "./view-data-list-edit-popup.page";
import {ViewDataListPage} from "../view-data-list.page";


export class ViewDataListAttributePopupPage extends AbstractViewDataAttributePopupPage {

    clickOk2(): ViewDataListEditPopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-done]`)
            .click({force: true});
        cy.wait(100);
        return new ViewDataListEditPopupPage();
    }

    clickCancel2(): ViewDataListEditPopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-cancel]`)
            .click({force: true});
        cy.wait(100);
        return new ViewDataListEditPopupPage();
    }

    clickOk(): ViewDataListPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-done]`)
            .click({force: true});
        cy.wait(100);
        return new ViewDataListPage();
    }

    clickCancel(): ViewDataListPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-cancel]`)
            .click({force: true});
        cy.wait(100);
        return new ViewDataListPage();
    }
}
