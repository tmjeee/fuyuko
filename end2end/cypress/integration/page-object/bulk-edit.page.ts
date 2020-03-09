import {ActualPage} from "./actual.page";
import * as util from '../util/util';
import {OperatorType} from "../model/operator.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../model/unit.model";


export class BulkEditPage implements ActualPage<BulkEditPage> {

    constructor() { }

    visit(): BulkEditPage {
        cy.visit('/gen-layout/(bulk-edit//help:bulk-edit-help)');
        return this;
    }

    validateTitle(): BulkEditPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'bulk-edit');
        return this;
    }

    verifyErrorMessageExists(): BulkEditPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): BulkEditPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    ////////////////////

    selectView(viewName: string): BulkEditPage {
        cy.get(`[test-page-title='bulk-edit']`)
            .find(`[test-mat-select-current-view] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-current-view='${viewName}']`)
            .click({force: true});
        return this;
    }

    verifySelectedView(viewName: string): BulkEditPage {
        cy.get(`[test-page-title='bulk-edit']`)
            .find(`[test-bulk-edit-wizard='${viewName}']`)
            .should('exist');
        return this;
    }


    startWizard(): BulkEditPageStep1 {
        return new BulkEditPageStep1();
    }


}

export class BulkEditPageStep1 {

    verifyStep(): BulkEditPageStep1 {
        cy.get(`mat-step-header[ng-reflect-index='0']`)
            .should('have.attr', 'ng-reflect-selected', 'true');
        return this;
    }

    clickAddChangeClause(): BulkEditPageStep1 {
        cy.get(`[test-button-add-change-clause]`)
            .click({force: true});
        return this;
    }

    clickAddWhenClause(): BulkEditPageStep1 {
        cy.get(`[test-button-add-when-clause]`)
            .click({force: true});
        return this;
    }

    selectChangeAttribute(index: number, attributeName: string): BulkEditPageStep1 {
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-attribute] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-attribute='${attributeName}']`)
            .click({force: true});
        cy.wait(100);
        return this;
    }

    _verifyChangeClauseAttributeName(index: number, attributeName: string): BulkEditPageStep1 {
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-attribute]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', attributeName);
        return this;
    }

    // string
    editChangeString(index: number, attributeName: string, value: string): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-string]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }
    verifyChangeClauseString(index: number, attributeName: string, value: string): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-string]`)
            .should('contain.value', value);
        return this;
    }

    // text
    editChangeText(index: number, attributeName: string, value: string): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-text]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }
    verifyChangeClauseText(index: number, attributeName: string, value: string): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-text]`)
            .should('contain.value', value);
        return this;
    }

    // number
    editChangeNumber(index: number, attributeName: string, value: number): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-number]`)
            .clear({force: true})
            .type(String(value), {force: true});
        return this;
    }
    verifyChangeClauseNumber(index: number, attributeName: string, value: number): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-number]`)
            .should('contain.value', value);
        return this;
    }

    // date
    editChangeDate(index: number, attributeName: string, value: string /* DD-MM-YYYY */): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-date]`)
            .clear({force: true})
            .type(String(value), {force: true});
        return this;
    }
    verifyChangeClauseDate(index: number, attributeName: string, value: string): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-date]`)
            .should('contain.value', value);
        return this;
    }

    // currency
    editChangeCurrency(index: number, attributeName: string, value: number, unit: CountryCurrencyUnits): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-currency-unit] div`).click({force: true})
        cy.get(`[test-mat-select-option-currency-unit='${unit}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-currency]`)
            .clear({force: true})
            .type(String(value), {force: true});
        return this;
    }
    verifyChangeClauseCurrency(index: number, attributeName: string, value: number, unit: CountryCurrencyUnits): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-currency-unit]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', unit);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-currency]`)
            .should('contain.value', value);
        return this;
    }

    // volume
    editChangeVolume(index: number, attributeName: string, value: number, unit: VolumeUnits): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-volume-unit] div`).click({force: true})
        cy.get(`[test-mat-select-option-volume-unit='${unit}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-volume]`)
            .clear({force: true})
            .type(String(value), {force: true});
        return this;
    }
    verifyChangeClauseVolume(index: number, attributeName: string, value: number, unit: VolumeUnits): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-volume-unit]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', unit);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-volume]`)
            .should('contain.value', value);
        return this;
    }

    // dimension
    editChangeDimension(index: number, attributeName: string, length: number, width: number, height: number, unit: DimensionUnits): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-dimension-unit] div`).click({force: true})
        cy.get(`[test-mat-select-option-dimension-unit='${unit}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-dimension-length]`)
            .clear({force: true})
            .type(String(length), {force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-dimension-width]`)
            .clear({force: true})
            .type(String(width), {force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-dimension-height]`)
            .clear({force: true})
            .type(String(height), {force: true});
        return this;
    }
    verifyChangeClauseDimension(index: number, attributeName: string, value: number, unit: DimensionUnits): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-dimension-unit]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', unit);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-dimension-length]`)
            .should('contain.value', value);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-dimension-width]`)
            .should('contain.value', value);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-dimension-height]`)
            .should('contain.value', value);
        return this;
    }

    // area
    editChangeArea(index: number, attributeName: string, area: number, unit: AreaUnits):BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-area-unit] div`).click({force: true})
        cy.get(`[test-mat-select-option-area-unit='${unit}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-area]`)
            .clear({force: true})
            .type(String(area), {force: true});
        return this;
    }
    verifyChangeClauseArea(index: number, attributeName: string, value: number, unit: AreaUnits): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-area-unit]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', unit);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-area]`)
            .should('contain.value', value);
        return this;
    }

    // length
    editChangeLength(index: number, attributeName: string, length: number, unit: LengthUnits): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-length-unit] div`).click({force: true})
        cy.get(`[test-mat-select-option-length-unit='${unit}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-length]`)
            .clear({force: true})
            .type(String(length), {force: true});
        return this;
    }
    verifyChangeClauseLength(index: number, attributeName: string, value: number, unit: LengthUnits): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-length-unit]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', unit);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-length]`)
            .should('contain.value', value);
        return this;
    }

    // width
    editChangeWidth(index: number, attributeName: string, width: number, unit: WidthUnits): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-width-unit] div`).click({force: true})
        cy.get(`[test-mat-select-option-width-unit='${unit}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-width]`)
            .clear({force: true})
            .type(String(width), {force: true});
        return this;
    }
    verifyChangeClauseWidth(index: number, attributeName: string, value: number, unit: WidthUnits): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-width-unit]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', unit);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-width]`)
            .should('contain.value', value);
        return this;
    }

    // height
    editChangeHeight(index: number, attributeName: string, height: number, unit: HeightUnits): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-height-unit] div`).click({force: true})
        cy.get(`[test-mat-select-option-height-unit='${unit}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-height]`)
            .clear({force: true})
            .type(String(height), {force: true});
        return this;
    }
    verifyChangeClauseHeight(index: number, attributeName: string, value: number, unit: AreaUnits): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-height-unit]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', unit);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-height]`)
            .should('contain.value', value);
        return this;
    }

    // select
    editChangeSelect(index: number, attributeName: string, key: string): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-select] div`).click({force: true});
        cy.get(`[test-mat-select-option-select='${key}']`).click({force: true});
        return this;
    }
    verifyChangeClauseSelect(index: number, attributeName: string, key: string): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-select]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', key);
        return this;
    }

    // doubleselect
    editChangeDoubleSelect(index: number, attributeName: string, key1: string, key2: string): BulkEditPageStep1 {
        this.selectChangeAttribute(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-doubleselect-1] div`).click({force: true});
        cy.get(`[test-mat-select-option-doubleselect-1='${key1}']`).click({force: true});
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-doubleselect-2] div`).click({force: true});
        cy.get(`[test-mat-select-option-doubleselect-2='${key2}']`).click({force: true});
        return this;
    }
    verifyChangeClauseDoubleSelect(index: number, attributeName: string, key1: string, key2: string): BulkEditPageStep1 {
        this._verifyChangeClauseAttributeName(index, attributeName);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-doubleselect-1]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', key1);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-doubleselect-2]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', key2);
        return this;
    }


    selectWhereAttribute(index: number, attributeName: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-select-attribute] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-select-option-attribute='${attributeName}']`)
            .click({force: true});
        cy.wait(100);
        return this;
    }

    selectWhereOperator(index: number, operator: OperatorType): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-select-attribute-operator] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-select-option-attribute-operator='${operator}']`)
            .click({force: true});
        cy.wait(100);
        return this;
    }


    editWhereFieldValue(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }


    editWhereFieldValue2(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value2]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }


    editWhereFieldValue3(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value3]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }

    editWhereFieldValue4(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value3]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }

    // string
    editWhereString(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, value);
        return this;
    }

    _verifyWhereClauseAttribute(index: number, attributeName: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-select-attribute]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', attributeName);
        return this;
    }

    _verifyWhereClauseOperator(index: number, operator: OperatorType): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-select-attribute-operator]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', operator);
        return this;
    }

    _verifyWhereFieldValue(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value]`)
            .should('contain.value', value);
        return this;
    }

    _verifyWhereFieldValue2(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value2]`)
            .should('contain.value', value);
        return this;
    }

    _verifyWhereFieldValue3(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value3]`)
            .should('contain.value', value);
        return this;
    }

    _verifyWhereFieldValue4(index: number, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value4]`)
            .should('contain.value', value);
        return this;
    }

    verifyWhereClauseString(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, value);
        return this;
    }


    // text
    editWhereText(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, value);
        return this;
    }

    verifyWhereClauseText(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, value);
        return this;
    }

    // number
    editWhereNumber(index: number, attributeName: string, operator: OperatorType, value: number): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        return this;
    }
    verifyWhereClauseNumber(index: number, attributeName: string, operator: OperatorType, value: number): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(value));
        return this;
    }

    // date
    editWhereDate(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        return this;
    }
    verifyWhereClauseDate(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, value);
        return this;
    }

    // currency
    editWhereCurrency(index: number, attributeName: string, operator: OperatorType, value: number, unit: CountryCurrencyUnits): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        this.editWhereFieldValue2(index, unit);
        return this;
    }
    verifyWhereClauseCurrency(index: number, attributeName: string, operator: OperatorType, value: number, unit: CountryCurrencyUnits): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(value));
        this._verifyWhereFieldValue2(index, unit)
        return this;
    }

    // volume
    editWhereVolume(index: number, attributeName: string, operator: OperatorType, value: number, unit: VolumeUnits): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        this.editWhereFieldValue2(index, unit);
        return this;
    }
    verifyWhereClauseVolume(index: number, attributeName: string, operator: OperatorType, value: number, unit: VolumeUnits): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(value));
        this._verifyWhereFieldValue2(index, unit)
        return this;
    }

    // dimension
    editWhereDimension(index: number, attributeName: string, operator: OperatorType, length: number, width: number, height: number, unit: DimensionUnits): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(length));
        this.editWhereFieldValue2(index, String(width));
        this.editWhereFieldValue3(index, String(height));
        this.editWhereFieldValue4(index, unit);
        return this;
    }
    verifyWhereClauseDimension(index: number, attributeName: string, operator: OperatorType, length: number, width: number, height: number, unit: DimensionUnits): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(length));
        this._verifyWhereFieldValue2(index, String(width));
        this._verifyWhereFieldValue3(index, String(height));
        this._verifyWhereFieldValue4(index, unit);
        return this;
    }

    // area
    editWhereArea(index: number, attributeName: string, operator: OperatorType, value: number, unit: AreaUnits): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        this.editWhereFieldValue2(index, unit);
        return this;
    }
    verifyWhereClauseArea(index: number, attributeName: string, operator: OperatorType, value: number, unit: AreaUnits): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(value));
        this._verifyWhereFieldValue2(index, unit)
        return this;
    }

    // length
    editWhereLength(index: number, attributeName: string, operator: OperatorType, value: number, unit: LengthUnits): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        this.editWhereFieldValue2(index, unit);
        return this;
    }
    verifyWhereClauseLength(index: number, attributeName: string, operator: OperatorType, value: number, unit: LengthUnits): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(value));
        this._verifyWhereFieldValue2(index, unit)
        return this;
    }

    // width
    editWhereWidth(index: number, attributeName: string, operator: OperatorType, value: number, unit: WidthUnits): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        this.editWhereFieldValue2(index, unit);
        return this;
    }
    verifyWhereClauseWidth(index: number, attributeName: string, operator: OperatorType, value: number, unit: WidthUnits): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(value));
        this._verifyWhereFieldValue2(index, unit)
        return this;
    }

    // height
    editWhereHeight(index: number, attributeName: string, operator: OperatorType, value: number, unit: HeightUnits): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, String(value));
        this.editWhereFieldValue2(index, unit);
        return this;
    }
    verifyWhereClauseHeight(index: number, attributeName: string, operator: OperatorType, value: number, unit: HeightUnits): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, String(value));
        this._verifyWhereFieldValue2(index, unit)
        return this;
    }

    // select
    editWhereSelect(index: number, attributeName: string, operator: OperatorType, key: string): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, key);
        return this;
    }
    verifyWhereClauseSelect(index: number, attributeName: string, operator: OperatorType, key: string): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, key);
        return this;
    }

    // doubleselect
    editWhereDoubleselect(index: number, attributeName: string, operator: OperatorType, key1: string, key2: string): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        this.editWhereFieldValue(index, key1);
        this.editWhereFieldValue2(index, key2);
        return this;
    }
    verifyWhereClauseDoubleselect(index: number, attributeName: string, operator: OperatorType, key1: string, key2: string): BulkEditPageStep1 {
        this._verifyWhereClauseAttribute(index, attributeName);
        this._verifyWhereClauseOperator(index, operator);
        this._verifyWhereFieldValue(index, key1);
        this._verifyWhereFieldValue2(index, key2)
        return this;
    }

    clickNext(): BulkEditPageStep2 {
        cy.get(`[test-step1-next]`)
            .click({force: true});
        return new BulkEditPageStep2();
    }
}

export class BulkEditPageStep2 {

    verifyStep(): BulkEditPageStep2 {
        cy.get(`mat-step-header[ng-reflect-index='1']`)
            .should('have.attr', 'ng-reflect-selected', 'true');
        return this;
    }

    clickPrevious(): BulkEditPageStep1 {
        cy.get(`[test-button-step2-prev]`).click({force: true});
        return new BulkEditPageStep1();
    }
    clickNext(): BulkEditPageStep3 {
        cy.get(`[test-button-step2-next]`).click({force: true});
        return new BulkEditPageStep3();
    }

    verifyItemOldValue(itemName: string, attributeName: string, value: string): BulkEditPageStep2 {
        cy.get(`[test-bulk-edit-review-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-table-column-old-value='${attributeName}']`)
            .should('contain.text', value);
        return this;
    }

    verifyItemNewValue(itemName: string, attributeName: string, value: string): BulkEditPageStep2 {
        cy.get(`[test-bulk-edit-review-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-table-column-new-value='${attributeName}']`)
            .should('contain.text', value);
        return this;
    }

    verifyItemWhenCause(itemName: string, value: string): BulkEditPageStep2 {
        cy.get(`[test-bulk-edit-review-table]`)
            .find(`[test-table-column-when]`)
            .should('contain.text', value);
        return this;
    }
}

export class BulkEditPageStep3 {

    verifyStep(): BulkEditPageStep3 {
        cy.get(`mat-step-header[ng-reflect-index='2']`)
            .should('have.attr', 'ng-reflect-selected', 'true');
        return this;
    }

    clickDone(): BulkEditPage {
        cy.get(`[test-button-step3-done]`).click({force: true});
        return new BulkEditPage();
    }

    verifyJobDone(): BulkEditPageStep3 {
        cy.get(`[test-info-job-progress`).should('exist');
        return this;
    }
}
