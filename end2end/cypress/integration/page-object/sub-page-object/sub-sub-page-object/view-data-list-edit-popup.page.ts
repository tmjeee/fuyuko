import {AbstractViewDataEditPopupPage} from "./abstract-view-data-edit-popup.page";
import {ViewDataListAttributePopupPage} from "./view-data-list-attribute-popup.page";
import {ViewDataListItemPopupPage} from "./view-data-list-item-popup.page";
import {ViewDataListPage} from "../view-data-list.page";


export class ViewDataListEditPopupPage extends AbstractViewDataEditPopupPage<ViewDataListItemPopupPage, ViewDataListAttributePopupPage> {

    createAbstractViewDataAttributePopupPage(): ViewDataListAttributePopupPage {
        return new ViewDataListAttributePopupPage(this.PAGE_NAME);
    }

    createAbstractViewDataItemPopupPage(): ViewDataListItemPopupPage {
        return new ViewDataListItemPopupPage(this.PAGE_NAME);
    }

    clickOk() {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']
            [test-button-item-data-editor-popup-ok]`))
            .click({force: true})
            .wait(100);
        return new ViewDataListPage();
    }

    clickCancel() {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']
            [test-button-item-data-editor-popup-cancel]`))
            .click({force: true})
            .wait(100);
        return new ViewDataListPage();
    }

}
