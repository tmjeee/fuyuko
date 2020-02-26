import {View} from "../../../model/view.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../../model/unit.model";
import {ViewDataTablePage} from "../view-data-table.page";


export class ViewDataTableEditPopupPage {

    verifyPopupTitle(): ViewDataTableEditPopupPage {
        cy.get(`[test-popup-dialog-title]`)
            .should('have.attr', 'test-popup-dialog-title', 'data-editor-dialog-popup');
        return this;
    }

    editStringValue(v: string): ViewDataTableEditPopupPage {
        cy.get(`[test-field-string]`)
            .clear({force: true})
            .type(v, {force: true});
        return this;
    }

    editTextValue(v: string): ViewDataTableEditPopupPage {
        cy.get(`[test-field-text]`)
            .clear({force: true})
            .type(v, {force: true});
        return this;
    }


    editNumberValue(v: number): ViewDataTableEditPopupPage {
        cy.get(`[test-field-number]`)
            .clear({force: true})
            .type(String(v), {force: true});
        return this;
    }

    editDateValue(v: string /* DD-MM-YYYY */): ViewDataTableEditPopupPage {
        cy.get(`[test-field-date]`)
            .clear({force: true})
            .type(v, {force: true});
        return this;
    }

    editCurrencyValue(v: number, unit: CountryCurrencyUnits): ViewDataTableEditPopupPage {
        cy.get(`[test-field-currency]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-mat-select-currency] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-currency='${unit}']`).click({force: true});
        return this;
    }

    editAreaValue(v: number, unit: AreaUnits): ViewDataTableEditPopupPage {
        cy.get(`[test-field-area]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-mat-select-area] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-area='${unit}']`).click({force: true});
        return this;
    }

    editVolumeValue(v: number, unit: VolumeUnits): ViewDataTableEditPopupPage {
        cy.get(`[test-field-volume]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-mat-select-volume] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-volume='${unit}']`).click({force: true});
        return this;
    }

    editDimensionValue(l: number, w: number, h: number, unit: DimensionUnits): ViewDataTableEditPopupPage {
        cy.get(`[test-field-dimension-length]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-field-dimension-width]`)
            .clear({force: true})
            .type(String(w), {force: true});
        cy.get(`[test-field-dimension-height]`)
            .clear({force: true})
            .type(String(h), {force: true});
        cy.get(`[test-mat-select-dimension] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-dimension='${unit}']`).click({force: true});
        return this;
    }

    editLengthValue(v: number, unit: LengthUnits): ViewDataTableEditPopupPage {
        cy.get(`[test-field-length]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-mat-select-length] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-length='${unit}']`).click({force: true});
        return this;
    }

    editWidthValue(v: number, unit: WidthUnits): ViewDataTableEditPopupPage {
        cy.get(`[test-field-width]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-mat-select-width] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-width='${unit}']`).click({force: true});
        return this;
    }

    editHeightValue(v: number, unit: HeightUnits): ViewDataTableEditPopupPage {
        cy.get(`[test-field-height]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-mat-select-height] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-height='${unit}']`).click({force: true});
        return this;
    }

    editSelectValue(key: string): ViewDataTableEditPopupPage {
        cy.get(`[test-mat-select-select-key] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-select-key='${key}']`).click({force: true});
        return this;
    }

    editDoubleSelectValue(key1: string, key2: string): ViewDataTableEditPopupPage {
        cy.get(`[test-mat-select-doubleselect-key1] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-doubleselect-key1='${key1}']`).click({force: true});
        cy.get(`[test-mat-select-doubleselect-key2] div`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-doubleselect-key2='${key2}']`).click({force: true});
        return this;
    }

    clickCancel(): ViewDataTablePage {
        cy.get(`[test-button-popup-cancel]`).click({force: true});
        cy.wait(1000);
        return new ViewDataTablePage();
    }

    clickDone(): ViewDataTablePage {
        cy.get(`[test-button-popup-done]`).click({force: true});
        cy.wait(1000);
        return new ViewDataTablePage();
    }
}
