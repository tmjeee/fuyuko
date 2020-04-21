import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailEditPopupPage} from "./view-data-thumbnail-edit-popup.page";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";


export class ViewDataThumbnailItemPopupPage extends AbstractViewDataItemPopupPage {

    //////////////////////////////////////////////////////////////////////

    clickOk(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-ok]`)
            .click({force: true})
            .wait(1000);
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-cancel]`)
            .click({force: true})
            .wait(1000);
        return new ViewDataThumbnailPage();
    }


    clickCancel2(): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-cancel]`)
            .click({force: true})
            .wait(1000);
        return new ViewDataThumbnailEditPopupPage();
    }


    clickOk2(): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-button-item-editor-popup-ok]`)
            .click({force: true})
            .wait(1000);
        return new ViewDataThumbnailEditPopupPage();
    }
}
