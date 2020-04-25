import {ActualPage} from "../actual.page";
import * as util from '../../util/util';
import {ImportPageStep1, ImportPageStep2, ImportPageStep3, ImportPageStep4} from "./import.page";
import {OperatorType, StringOperatorType, TextOperatorType} from "../../model/operator.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../model/unit.model";
import {AttributeType} from "../../model/attribute.model";


export class ExportPage implements ActualPage<ExportPage> {

    visit(): ExportPage {
        cy.visit('/import-export-gen-layout/(export//help:import-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): ExportPage {
        util.waitUntilTestPageReady();
        cy.wait(2000);
        return this;
    }

    validateTitle(): ExportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'export');
        return this;
    }

    verifyErrorMessageExists(): ExportPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ExportPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    /////////////////////////

    clickStep1(): ExportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1']`).click({force: true});
        return new ExportPageStep1();
    }
}

export class ExportPageStep1 {

    verifyInStep(): ExportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    selectExportView(viewName: string): ExportPageStep1 {
        cy.get(`[test-mat-select-step1-export-view]`).first().click({force: true});
        cy.get(`[test-mat-select-option-step1-export-view='${viewName}']`).click({force: true});
        return this;
    }

    verifyCanClickNext(b: boolean): ExportPageStep1 {
        cy.get(`[test-button-step1-next]`).should(b ? 'be.enabled' : 'not.be.enabled');
        cy.wait(100);
        return this;
    }

    clickNext(): ExportPageStep2 {
        cy.get(`[test-button-step1-next]`).click({force: true});
        cy.wait(100);
        return new ExportPageStep2();
    }
}


export class ExportPageStep2 {

    private exportType: string;

    constructor(exportType?: string) {
       this.exportType = exportType;
    }

    verifyInStep(): ExportPageStep2 {
        cy.get(`mat-step-header[aria-posinset='2'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    clickBack(): ExportPageStep1 {
        cy.get(`[test-button-step2-back]`).click({force: true});
        cy.wait(100);
        return new ExportPageStep1();
    }

    clickNext(): ExportPageStep3 | ExportPageStep4 {
        cy.get(`[test-button-step2-next]`).click({force: true});
        cy.wait(100);
        if (this.exportType === 'ATTRIBUTE') {
            return new ExportPageStep4(this.exportType);
        }
        return new ExportPageStep3();
    }

    selectExportType(type: 'ATTRIBUTE' | 'ITEM' | 'PRICE'): ExportPageStep2 {
        this.exportType = type;
        cy.get(`[test-mat-select-step2-export-type]`).first().click({force: true});
        cy.get(`[test-mat-select-option-step2-export-type='${type}']`).click({force: true});
        return this;
    }

    selectExportAllAttributes(): ExportPageStep2 {
        cy.get(`[test-radio-step2-export-all-attributes]`).click({force: true});
        return this;
    }

    selectExportSelectedAttributes(attributeNames: string[]): ExportPageStep2 {
        cy.get(`[test-radio-step2-export-selected-attributes]`).click({force: true});
        cy.wrap(attributeNames).each((e, i, a) => {
            return cy.get(`[test-checkbox-step2-attribute-select='${attributeNames[i]}']`).click({force: true});
        });
        return this;
    }

    selectPricingStructure(pricingStructureName: string): ExportPageStep2 {
        cy.get(`[test-mat-select-step2-pricing-structure]`).first().click({force: true});
        cy.get(`[test-mat-select-option-step2-pricing-structure='${pricingStructureName}']`).click({force: true});
        return this;
    }
}

export class ExportPageStep3 {


    addItemFilter(): ExportPageStep3 {
        cy.get(`[test-button-step3-add-filtering]`).click({force: true});
        return this;
    }

    _selectItemFilterAttribute(index: number, attributeName: string): ExportPageStep3 {
        // attribute
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-select-attribute]`).first()
            .click({force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-select-option-attribute='${attributeName}']`)
            .click({force: true});
        return this;
    }

    _selectItemFilterOperator(index: number, operator: OperatorType): ExportPageStep3 {
        // operator
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-select-attribute-operator]`).first()
            .click({force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-select-option-attribute-operator='${operator}']`)
            .click({force: true});
        return this;
    }

    editItemFilter_string(index: number, attributeName: string, operator: StringOperatorType, value: string): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        // value
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(value, {force: true});

        return this;
    }

    editItemFilter_text(index: number, attributeName: string, operator: TextOperatorType, value: string): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }

    // number
    editItemFilter_number(index: number, attributeName: string, operator: TextOperatorType, value: number): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(value), {force: true});
        return this;
    }

    // 'date',
    editItemFilter_date(index: number, attributeName: string, operator: TextOperatorType, value: string /* DD-MM-YYYY */): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }

    // 'currency',
    editItemFilter_currency(index: number, attributeName: string, operator: TextOperatorType, value: number, unit: CountryCurrencyUnits): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(value), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-currency-unit]`).first().click({force: true})
        cy.get(`[test-mat-select-option-field-currency-unit='${unit}']`).click({force: true});
        return this;
    }

    // 'volume',
    editItemFilter_volume(index: number, attributeName: string, operator: TextOperatorType, value: number, unit: VolumeUnits): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(value), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-volume-unit]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-volume-unit='${unit}']`).click({force: true});
        return this;
    }
    // 'dimension',
    editItemFilter_dimension(index: number, attributeName: string, operator: TextOperatorType, length: number, width: number, height: number, unit: DimensionUnits): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(length), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value2]`)
            .clear({force: true})
            .type(String(width), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value3]`)
            .clear({force: true})
            .type(String(height), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-dimension-unit]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-dimension-unit='${unit}']`).click({force: true});
        return this;
    }
    // 'area',
    editItemFilter_area(index: number, attributeName: string, operator: TextOperatorType, value: number, unit: AreaUnits): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(value), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-area-unit]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-area-unit='${unit}']`)
        return this;
    }
    // 'width',
    editItemFilter_width(index: number, attributeName: string, operator: TextOperatorType, value: number, unit: WidthUnits): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(value), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-width-unit]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-width-unit='${unit}']`).click({force: true});
        return this;
    }
    // 'length',
    editItemFilter_length(index: number, attributeName: string, operator: TextOperatorType, value: number, unit: LengthUnits): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(value), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-length-unit]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-length-unit='${unit}]`).click({force: true});
        return this;
    }
    // 'height',
    editItemFilter_height(index: number, attributeName: string, operator: TextOperatorType, value: number, unit: HeightUnits): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(String(value), {force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-height-unit]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-height-unit='${unit}']`).click({force: true});
        return this;
    }
    // 'select',
    editItemFilter_select(index: number, attributeName: string, operator: TextOperatorType, key: string): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-at-select-field-select]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-select='${key}']`).click({force: true});
        return this;
    }
    // 'doubleselect'];
    editItemFilter_doubleselect(index: number, attributeName: string, operator: TextOperatorType, key1: string, key2: string): ExportPageStep3 {
        this._selectItemFilterAttribute(index, attributeName);
        this._selectItemFilterOperator(index, operator);
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-doubleselect-1]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-doubleselect-1='${key1}']`).click({force: true});
        cy.get(`[test-attribute-operator-editor-step3='${index}']`)
            .find(`[test-mat-select-field-doubleselect-2]`).first().click({force: true});
        cy.get(`[test-mat-select-option-field-doubleselect-2='${key2}']`).click({force: true});
        return this;
    }


    clickNext(): ExportPageStep4 {
        cy.get(`[test-button-step3-next]`).click({force:true});
        cy.wait(100);
        return new ExportPageStep4();
    }

    clickBack(): ExportPageStep2 {
        cy.get(`[test-button-step3-back]`).click({force: true});
        cy.wait(100)
        return new ExportPageStep2();
    }

    verifyInStep(): ExportPageStep3 {
        cy.get(`mat-step-header[aria-posinset='3'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }
}

export class ExportPageStep4 {

    private exportType;

    constructor(exportType?: string) {
        this.exportType = exportType;
    }


    verifyInStep(): ExportPageStep4 {
        if (this.exportType === 'ATTRIBUTE') {
            cy.get(`mat-step-header[aria-posinset='3'`)
                .should('have.attr', 'tabindex', '0');

        } else {
            cy.get(`mat-step-header[aria-posinset='4'`)
                .should('have.attr', 'tabindex', '0');
        }
        return this;
    }

    clickNext(): ExportPageStep5 {
        cy.get(`[test-button-step4-next]`).click({force: true});
        cy.wait(100);
        return new ExportPageStep5(this.exportType);
    }

    clickBack(): ExportPageStep3 | ExportPageStep2 {
        cy.get(`[test-button-step4-back]`).click({force: true});
        cy.wait(100);
        if (this.exportType === 'ATTRIBUTE') {
            return new ExportPageStep2(this.exportType);
        }
        return new ExportPageStep3();
    }

    verifyAttributeExport_attributeExists(attributeName: string, attributeType: AttributeType): ExportPageStep4 {
        cy.get(`[test-table-step4-attribute]`)
            .find(`[test-table-row='${attributeName}']`)
            .find(`[test-table-column-attribute-name]`).should('have.attr', 'test-table-column-attribute-name', attributeName);
        cy.get(`[test-table-step4-attribute]`)
            .find(`[test-table-row='${attributeName}']`)
            .find(`[test-table-column-attribute-type]`).should ('have.attr', 'test-table-column-attribute-type', attributeType)
        return this;
    }

    verifyItemExport_itemExists(itemName: string): ExportPageStep4 {
        cy.get(`[test-table-step4-item]`)
            .find(`[test-table-row='${itemName}']`).should('have.attr', 'test-table-row', itemName);
        return this;
    }

    expandItem(itemName: string): ExportPageStep4 {
        cy.get(`[test-table-step4-item]`)
            .find(`[test-table-row='${itemName}']`).then((_) => {
            const l = _.find(`[test-row-isExpanded='false']`).length;
            if (l > 0) {
                cy.get(`[test-table-step4-item]`)
                    .find(`[test-table-row='${itemName}']`)
                    .find(`[test-row-isExpanded]`)
                    .click({force: true});
            }
            return cy.wait(1000);
        }).wait(100);
        return this;
    }

    verifyItemExport_itemAttributeValue(itemName: string, attributeName: string, values: string[]): ExportPageStep4 {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-table-step4-item]`)
                .find(`[test-table-row='${itemName}']`)
                .find(`[test-table-column-attribute='${attributeName}']`)
                .should('contain.text', values[i]);
        });
        return this;
    }

    verifyItemExport_itemVisible(itemName: string, b: boolean): ExportPageStep4 {
        cy.get(`[test-table-step4-item]`)
            .find(`[test-table-row='${itemName}']`).should(b ? 'be.visible' : 'not.be.visible');
        return this;
    }

    verifyPriceExport_price(itemName: string, values: string[]): ExportPageStep4 {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-table-step4-price]`)
                .find(`[test-table-row='${itemName}']`)
                .find(`[test-table-column-price]`)
                .should('contain.text', values[i]);
        });
        return this;
    }

    verifyPriceExport_priceUnit(itemName: string, values: string[]): ExportPageStep4 {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-table-step4-price]`)
                .find(`[test-table-row='${itemName}']`)
                .find(`[test-table-column-price-unit]`)
                .should('contain.text', values[i]);
        });
        return this;
    }
}

export class ExportPageStep5 {

    private exportType: string;

    constructor(exportType?: string) {
        this.exportType = exportType;
    }


    verifyInStep(): ExportPageStep5 {
        if (this.exportType === 'ATTRIBUTE') {
            cy.get(`mat-step-header[aria-posinset='4'`)
                .should('have.attr', 'tabindex', '0');

        } else {
            cy.get(`mat-step-header[aria-posinset='5'`)
                .should('have.attr', 'tabindex', '0');
        }
        return this;
    }


    clickDone(): ImportPageStep1 {
        cy.get(`[test-button-step5-done]`).click({force: true});
        return new ImportPageStep1();
    }

}
