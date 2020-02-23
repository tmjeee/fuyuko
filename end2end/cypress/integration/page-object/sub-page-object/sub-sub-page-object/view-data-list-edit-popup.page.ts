import {AbstractViewDataEditPopupPage} from "./abstract-view-data-edit-popup.page";
import {ViewDataListAttributePopupPage} from "./view-data-list-attribute-popup.page";
import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";
import {ViewDataListItemPopupPage} from "./view-data-list-item-popup.page";


export class ViewDataListEditPopupPage extends AbstractViewDataEditPopupPage {

    createAbstractViewDataAttributePopupPage(): AbstractViewDataAttributePopupPage {
        return new ViewDataListAttributePopupPage();
    }

    createAbstractViewDataItemPopupPage(): AbstractViewDataItemPopupPage {
        return new ViewDataListItemPopupPage();
    }

    ////////////////////////////////////////////////

    verifyPopupTitle(): ViewDataListEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

}
