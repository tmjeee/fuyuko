import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailAttributePopupPage} from "./view-data-thumbnail-attribute-popup.page";
import {ViewDataThumbnailItemPopupPage} from "./view-data-thumbnail-item-popup.page";
import {AbstractViewDataEditPopupPage} from "./abstract-view-data-edit-popup.page";
import * as util from "../../../util/util";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";


// this is the page where you can edit all attributes, item name and item description
export class ViewDataThumbnailEditPopupPage extends AbstractViewDataEditPopupPage<ViewDataThumbnailItemPopupPage, ViewDataThumbnailAttributePopupPage> {

    constructor(public PAGE_NAME: string) {
        super(PAGE_NAME);
    }

    createAbstractViewDataAttributePopupPage(): ViewDataThumbnailAttributePopupPage {
        return new ViewDataThumbnailAttributePopupPage(this.PAGE_NAME);
    }

    createAbstractViewDataItemPopupPage(): ViewDataThumbnailItemPopupPage {
        return new ViewDataThumbnailItemPopupPage(this.PAGE_NAME);
    }


    //////////////////////////////////////////////////////

    clickOk(): ViewDataThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']
            [test-button-item-data-editor-popup-ok]`))
            .click({force: true})
            .wait(100);
        this.waitForReady();
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']
            [test-button-item-data-editor-popup-cancel]`))
            .click({force: true})
            .wait(100);
        this.waitForReady();
        return new ViewDataThumbnailPage();
    }

}
