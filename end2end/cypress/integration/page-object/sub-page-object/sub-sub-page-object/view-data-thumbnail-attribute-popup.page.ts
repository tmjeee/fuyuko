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


export class ViewDataThumbnailAttributePopupPage {
    verifyPopupTitle(): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editStringAttribute(v: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-string]`)
            .clear({force: true})
            .type(v, {force: true});
        return this;
    }

    editTextAttribute(v: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-text]`)
            .clear({force: true})
            .type(v, {force: true});
        return this;
    }

    editNumericAttribute(v: number): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-number]`)
            .clear({force: true})
            .type(String(v), {force: true});
        return this;
    }

    editDateAttribute(v: string /* DD-MM-YYYY */): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-date]`)
            .clear({force: true})
            .type(v, {force: true})
        ;
        return this;
    }

    editCurrencyAttribute(v: number, unit: CountryCurrencyUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find((`[test-field-currency]`))
            .clear({force: true})
            .type(String(v), {force: true})
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-currency] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-currency='${unit}']`).click({force: true});
        return this;
    }

    editAreaAttribute(v: number, unit: AreaUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-area]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-area] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-area='${unit}]`).click({force: true});
        return this;
    }

    editVolumeAttribute(v: number, unit: VolumeUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-volume]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-volume] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-volume='${unit}]`).click({force: true});
        return this;
    }

    editDimensionAttribute(l: number, w: number, h: number, unit: DimensionUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-dimension-length]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-dimension-width]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-dimension-height]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-dimension] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-dimension='${unit}]`).click({force: true});
        return this;
    }

    editWidthAttribute(v: number, unit: WidthUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-width]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-width] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-width='${unit}]`).click({force: true});
        return this;
    }

    editLengthAttribute(v: number, unit: LengthUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-length]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-length] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-length='${unit}]`).click({force: true});
        return this;
    }

    editHeightAttribute(v: number, unit: HeightUnits): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-height]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-height] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-height='${unit}]`).click({force: true});
        return this;
    }

    editSelectAttribute(key: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-select-key] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-select-key='${key}]`).click({force: true});
        return this;
    }

    editDoubleSelectAttribute(key1: string, key2: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-doubleselect-key1] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-doubleselect-key1='${key1}]`).click({force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-doubleselect-key2] div`).click({force: true, multiple: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-option-doubleselect-key2='${key2}]`).click({force: true});
        return this;
    }

    clickOk<T extends ViewDataThumbnailPage | ViewDataThumbnailEditPopupPage>(rootPage: T): T {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-done]`)
            .click({force: true});
        return rootPage;
    }

    clickCancel<T extends ViewDataThumbnailPage | ViewDataThumbnailEditPopupPage>(rootPage: T): T {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-button-popup-cancel]`)
            .click({force: true});
        return rootPage;
    }
}
