import {AbstractViewDataEditPopupPage} from "./abstract-view-data-edit-popup.page";
import {ViewDataListAttributePopupPage} from "./view-data-list-attribute-popup.page";
import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";
import {ViewDataListItemPopupPage} from "./view-data-list-item-popup.page";


export class ViewDataListEditPopupPage extends AbstractViewDataEditPopupPage<ViewDataListItemPopupPage, ViewDataListAttributePopupPage> {

    createAbstractViewDataAttributePopupPage(): ViewDataListAttributePopupPage {
        return new ViewDataListAttributePopupPage();
    }

    createAbstractViewDataItemPopupPage(): ViewDataListItemPopupPage {
        return new ViewDataListItemPopupPage();
    }
}
