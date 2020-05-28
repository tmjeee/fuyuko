import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailEditPopupPage} from "./view-data-thumbnail-edit-popup.page";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";
import * as util from "../../../util/util";


export class ViewDataThumbnailItemPopupPage extends AbstractViewDataItemPopupPage {

    //////////////////////////////////////////////////////////////////////
    constructor(public PAGE_NAME: string){
        super(PAGE_NAME);
    }

    clickOk(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-ok]`)
            .click({force: true})
        this.waitForPopupGone();
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-cancel]`)
            .click({force: true})
        this.waitForPopupGone();
        return new ViewDataThumbnailPage();
    }


    clickCancel2(): ViewDataThumbnailEditPopupPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-cancel]`))
            .click({force: true})
        this.waitForPopupGone();
        return new ViewDataThumbnailEditPopupPage(this.PAGE_NAME);
    }


    clickOk2(): ViewDataThumbnailEditPopupPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-ok]`))
            .click({force: true})
        this.waitForPopupGone();
        return new ViewDataThumbnailEditPopupPage(this.PAGE_NAME);
    }
}
