import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../../model/unit.model";
import {ViewDataThumbnailPage} from "../view-data-thumbnail.page";


// this is the page where you can edit all attributes, item name and item description
export class ViewDataThumbnailEditPopupPage {
    verifyPopupTitle(): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editStringAttribute(attributeName: string, v: string): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})

        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-string='${attributeName}']`)
            .clear({force: true})
            .type(v);
        return this;
    }

    editTextAttribute(attributeName: string, v: string): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-text]`)
            .clear({force: true})
            .type(v, {force: true});
        return this;
    }

    editNumericAttribute(attributeName: string, v: number): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-number]`)
            .clear({force: true})
            .type(String(v), {force: true});
        return this;
    }

    editDateAttribute(attributeName: string, v: string /* DD-MM-YYYY */): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-date]`)
            .clear({force: true})
            .type(v, {force: true})
        ;
        return this;
    }

    editCurrencyAttribute(attributeName: string, v: number, unit: CountryCurrencyUnits): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find((`[test-field-currency]`))
            .clear({force: true})
            .type(String(v), {force: true})
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-currency] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-currency='${unit}']`).click({force: true});
        return this;
    }

    editAreaAttribute(attributeName: string, v: number, unit: AreaUnits): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-area]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-area] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-area='${unit}]`).click({force: true});
        return this;
    }

    editVolumeAttribute(attributeName: string, v: number, unit: VolumeUnits): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-volume]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-volume] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-volume='${unit}]`).click({force: true});
        return this;
    }

    editDimensionAttribute(attributeName: string, l: number, w: number, h: number, unit: DimensionUnits): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-dimension-length]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-dimension-width]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-dimension-height]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-dimension] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-dimension='${unit}]`).click({force: true});
        return this;
    }

    editWidthAttribute(attributeName: string, v: number, unit: WidthUnits): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-width]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-width] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-width='${unit}]`).click({force: true});
        return this;
    }

    editLengthAttribute(attributeName: string, v: number, unit: LengthUnits): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-length]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-length] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-length='${unit}]`).click({force: true});
        return this;
    }

    editHeightAttribute(attributeName: string, v: number, unit: HeightUnits): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-field-height]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-height] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-height='${unit}]`).click({force: true});
        return this;
    }

    editSelectAttribute(attributeName: string, key: string): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-select-key] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-select-key='${key}]`).click({force: true});
        return this;
    }

    editDoubleSelectAttribute(attributeName: string, key1: string, key2: string): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-doubleselect-key1] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-doubleselect-key1='${key1}]`).click({force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-doubleselect-key2] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-mat-select-option-doubleselect-key2='${key2}]`).click({force: true});
        return this;
    }

    clickOk(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-button-item-data-editor-popup-ok]`)
            .click({force: true});
        return new ViewDataThumbnailPage();
    }

    clickCancel(): ViewDataThumbnailPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-button-item-data-editor-popup-cancel]`)
            .click({force: true});
        return new ViewDataThumbnailPage();
    }
}
