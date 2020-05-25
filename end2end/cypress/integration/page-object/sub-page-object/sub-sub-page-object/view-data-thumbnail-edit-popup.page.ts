import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailAttributePopupPage} from "./view-data-thumbnail-attribute-popup.page";
import {ViewDataThumbnailItemPopupPage} from "./view-data-thumbnail-item-popup.page";
import {AbstractViewDataEditPopupPage} from "./abstract-view-data-edit-popup.page";


// this is the page where you can edit all attributes, item name and item description
export class ViewDataThumbnailEditPopupPage extends AbstractViewDataEditPopupPage<ViewDataThumbnailItemPopupPage, ViewDataThumbnailAttributePopupPage> {

    createAbstractViewDataAttributePopupPage(): ViewDataThumbnailAttributePopupPage {
        return new ViewDataThumbnailAttributePopupPage();
    }

    createAbstractViewDataItemPopupPage(): ViewDataThumbnailItemPopupPage {
        return new ViewDataThumbnailItemPopupPage();
    }

    //////////////////////////////////////////////////////

    clickOk(): ViewDataThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']
            [test-button-item-data-editor-popup-ok]`))
            .click({force: true})
            .wait(100);
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']
            [test-button-item-data-editor-popup-cancel]`))
            .click({force: true})
            .wait(100);
        return new ViewDataThumbnailPage();
    }

}
