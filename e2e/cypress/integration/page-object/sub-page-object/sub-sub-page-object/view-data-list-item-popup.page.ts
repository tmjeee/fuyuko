import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";
import {ViewDataListEditPopupPage} from "./view-data-list-edit-popup.page";
import {ViewDataListPage} from "../view-data-list.page";

export class ViewDataListItemPopupPage extends AbstractViewDataItemPopupPage {

    clickCancel2(): ViewDataListEditPopupPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-cancel]`))
            .click({force: true})
            .wait(100);
        return new ViewDataListEditPopupPage(this.PAGE_NAME);
    }


    clickOk2(): ViewDataListEditPopupPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-ok]`))
            .click({force: true})
            .wait(100);
        return new ViewDataListEditPopupPage(this.PAGE_NAME);
    }

    clickOk(): ViewDataListPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-ok]`))
            .click({force: true})
            .wait(100);
        return new ViewDataListPage();
    };

    clickCancel(): ViewDataListPage {
        cy.waitUntil(() => cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']
            [test-button-item-editor-popup-cancel]`))
            .click({force: true})
            .wait(100);
        return new ViewDataListPage();
    }
}
