import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";
import {ViewDataThumbnailEditPopupPage} from "./view-data-thumbnail-edit-popup.page";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../../model/unit.model";
import {ViewDataListPage} from "../view-data-list.page";
import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";


export class ViewDataThumbnailAttributePopupPage extends AbstractViewDataAttributePopupPage {

    ///////////////////////////////////////////////////////////////////

    clickOk<T extends ViewDataThumbnailPage | ViewDataThumbnailEditPopupPage>(rootPage: T): T {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-done]`)
            .click({force: true});
        cy.wait(100);
        return rootPage;
    }

    clickCancel<T extends ViewDataThumbnailPage | ViewDataThumbnailEditPopupPage>(rootPage: T): T {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-cancel]`)
            .click({force: true});
        cy.wait(100);
        return rootPage;
    }

    clickCancel1(): ViewDataThumbnailEditPopupPage {
        return this.clickCancel(new ViewDataThumbnailEditPopupPage());
    }

    clickOk1(): ViewDataThumbnailEditPopupPage {
        return this.clickOk(new ViewDataThumbnailEditPopupPage());
    }
}
