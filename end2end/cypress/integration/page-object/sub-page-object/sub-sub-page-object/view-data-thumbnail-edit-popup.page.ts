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


// this is the page where you can edit all attributes, item name and item description
export class ViewDataThumbnailEditPopupPage {
    verifyPopupTitle(): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editStringAttribute(attributeName: string, v: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})

        const e = new ViewDataThumbnailAttributePopupPage();
        e.editStringAttribute(v);
        return e;
    }

    editTextAttribute(attributeName: string, v: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})

        const e = new ViewDataThumbnailAttributePopupPage();
        e.editTextAttribute(v);
        return e;
    }

    editNumericAttribute(attributeName: string, v: number): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editNumericAttribute(v);
        return e;
    }

    editDateAttribute(attributeName: string, v: string /* DD-MM-YYYY */): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editDateAttribute(v);
        return e;
    }

    editCurrencyAttribute(attributeName: string, v: number, unit: CountryCurrencyUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editCurrencyAttribute(v, unit);
        return e;
    }

    editAreaAttribute(attributeName: string, v: number, unit: AreaUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editAreaAttribute(v, unit);
        return e;
    }

    editVolumeAttribute(attributeName: string, v: number, unit: VolumeUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editVolumeAttribute(v, unit);
        return e;
    }

    editDimensionAttribute(attributeName: string, l: number, w: number, h: number, unit: DimensionUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editDimensionAttribute(l, w, h, unit);
        return e;
    }

    editWidthAttribute(attributeName: string, v: number, unit: WidthUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editWidthAttribute(v, unit);
        return e;
    }

    editLengthAttribute(attributeName: string, v: number, unit: LengthUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editLengthAttribute(v, unit);
        return e;
    }

    editHeightAttribute(attributeName: string, v: number, unit: HeightUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editHeightAttribute(v, unit);
        return e;
    }

    editSelectAttribute(attributeName: string, key: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editSelectAttribute(key);
        return e;
    }

    editDoubleSelectAttribute(attributeName: string, key1: string, key2: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = new ViewDataThumbnailAttributePopupPage();
        e.editDoubleSelectAttribute(key1, key2);
        return e;
    }

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

    editItemName(name: string) : ViewDataThumbnailItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-item-editor='name']`)
            .find(`[test-item-editor-value='name']`)
            .click({force: true});

        const e = new ViewDataThumbnailItemPopupPage();
        e.editItemName(name)
        return e;
    }

    editItemDescription(description: string): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-item-editor='description']`)
            .find(`[test-item-editor-value='description']`)
            .click({force: true});

        const e = new ViewDataThumbnailItemPopupPage();
        e.editItemDescription(description)
        return e;
    }
}
