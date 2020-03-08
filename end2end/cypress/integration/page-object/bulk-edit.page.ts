import {ActualPage} from "./actual.page";
import * as util from '../util/util';
import {OperatorType} from "../model/operator.model";


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
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-attribute]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', attributeName);
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

    // number
    // date
    // currency
    // volume
    // dimension
    // area
    // length
    // width
    // height
    // select
    // doubleselect


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

    // string
    editWhereString(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        this.selectWhereAttribute(index, attributeName);
        this.selectWhereOperator(index, operator);
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }

    verifyWhereClauseString(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-select-attribute]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', attributeName);
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-select-attribute-operator]`)
            .find(`.mat-select-value-text`)
            .should('contain.text', operator);
        cy.get(`[test-where-clause-editor='${index}']`)
            .find(`[test-field-value]`)
            .should('contain.value', value);
        return this;
    }


    // text
    // number
    // date
    // currency
    // volume
    // dimension
    // area
    // length
    // width
    // height
    // select
    // doubleselect
}
