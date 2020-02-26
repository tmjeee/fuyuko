import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../../model/unit.model";
import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailAttributePopupPage} from "./view-data-thumbnail-attribute-popup.page";
import {ViewDataThumbnailItemPopupPage} from "./view-data-thumbnail-item-popup.page";
import {AbstractViewDataEditPopupPage} from "./abstract-view-data-edit-popup.page";
import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";


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
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-button-item-data-editor-popup-ok]`)
            .click({force: true})
            .wait(100);
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-button-item-data-editor-popup-cancel]`)
            .click({force: true})
            .wait(100);
        return new ViewDataThumbnailPage();
    }

}
