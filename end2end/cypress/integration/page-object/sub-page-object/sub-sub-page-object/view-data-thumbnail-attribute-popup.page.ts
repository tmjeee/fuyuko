import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailEditPopupPage} from "./view-data-thumbnail-edit-popup.page";
import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";


export class ViewDataThumbnailAttributePopupPage extends AbstractViewDataAttributePopupPage {

    ///////////////////////////////////////////////////////////////////

    clickOk<T extends ViewDataThumbnailPage | ViewDataThumbnailEditPopupPage>(rootPage: T): T {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']
            [test-button-popup-done]`))
            .click({force: true});
        this.waitForPopupGone();
        cy.wait(100);
        return rootPage;
    }

    clickCancel<T extends ViewDataThumbnailPage | ViewDataThumbnailEditPopupPage>(rootPage: T): T {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']
            [test-button-popup-cancel]`))
            .click({force: true});
        this.waitForPopupGone();
        cy.wait(100);
        return rootPage;
    }

    clickCancel1(): ViewDataThumbnailEditPopupPage {
        return this.clickCancel(new ViewDataThumbnailEditPopupPage(this.PAGE_NAME));
    }

    clickOk1(): ViewDataThumbnailEditPopupPage {
        return this.clickOk(new ViewDataThumbnailEditPopupPage(this.PAGE_NAME));
    }
}
