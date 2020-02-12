import * as util from "../../../util/util";
import {ViewRulePage} from "../view-rule.page";
import {OperatorType} from "../../../model/operator.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../../model/unit.model";
import {wheat} from "color-name";
import validate = WebAssembly.validate;

export class AbstractViewPredefinedRulePage {

    verifyErrorMessageExists(): AbstractViewPredefinedRulePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): AbstractViewPredefinedRulePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    verifySubmittable(b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-cancel]`).focus(); // code requires 'change' events to recalculate if done can be enabled
        cy.get(`[test-button-done]`).should(b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    submit(): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-done]`).click({force: true});
        return this;
    }
    cancel(): ViewRulePage {
        cy.get(`[test-button-cancel]`).click({force: true});
        return new ViewRulePage();
    }

    clickAddValidateClause(): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-add-rule-validate-clause]`).click({force: true});
        return this;
    }

    deleteValidateClause(index: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-delete-rule-validate-clause='${index}']`).click({force: true});
        return this;
    }

    clickAddWhenClause(): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-add-rule-when-clause]`).click({force: true});
        return this;
    }

    deleteWhenClause(index: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-delete-rule-when-clause='${index}']`).click({force: true});
        return this;
    }
    removeValidateClause(index: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-delete-rule-validate-clause='${index}']`).click({force: true});
        return this;
    }

    removeWhenClause(index: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-button-delete-rule-when-clause='${index}']`).click({force: true});
        return this;
    }

    verifyValidateClauseCount(count: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor]`).should('have.length', count);
        return this;
    }

    verifyWhenClauseCount(count: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor]`).should('have.length', count);
        return this;
    }


    selectWhenClauseAttribute(whenClauseIndex: number, attributeName: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute]`).click({force: true});
        cy.get(`[test-select-option-attribute='${attributeName}']`).click({force: true});
        return this;
    }

    verifyWhenClauseAttributeSelected(whenClauseIndex: number, attributeName: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should('have.text', attributeName)
        ;

        return this;
    }

    selectValidateClauseAttribute(validateClauseIndex: number, attributeName: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute]`).click({force: true});
        cy.get(`[test-select-option-attribute='${attributeName}']`).click({force: true});
        return this;
    }


    verifyValidateClauseAttributeSelected(validateClauseIndex: number, attributeName: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should('have.text', attributeName)
        ;
        return this;
    }

    selectWhenClauseOperator(whenClauseIndex: number, operator: OperatorType): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute-operator]`).click({force: true});
        cy.get(`[test-select-option-attribute-operator='${operator}']`).click({force: true});
        return this;
    }

    verifyWhenClauseOperatorSelected(whenClauseIndex: number, operator: OperatorType): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute-operator]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should(`have.text`, operator);
        return this;
    }

    selectValidateClauseOperator(validateClauseIndex: number, operator: OperatorType): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute-operator]`).click({force: true});
        cy.get(`[test-select-option-attribute-operator='${operator}']`).click({force: true});
        return this;
    }

    verifyValidateClauseOperatorSelected(validateClauseIndex: number, operator: OperatorType): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute-operator]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should(`have.text`, operator);
        return this;
    }

    verifyValidateClauseField1Exists(validateClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value1]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyValidateClauseField2Exists(validateClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value2]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyValidateClauseField3Exists(validateClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value3]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyValidateClauseField4Exists(validateClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value4]`).should(b ? 'exist' : 'not.exist');
        return this;
    }


    verifyWhenClauseField1Exists(whenClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value1]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyWhenClauseField2Exists(whenClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value2]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyWhenClauseField3Exists(whenClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value3]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyWhenClauseField4Exists(whenClauseIndex: number, b: boolean): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value4]`).should(b ? 'exist' : 'not.exist');
        return this;
    }


    fillInRuleName(name: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-field-rule-name]`).clear({force: true}).type(name, {force: true});
        return this;
    }

    fillInRuleDescription(description: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-field-rule-description]`).clear({force: true}).type(description, {force: true});
        return this;
    }

    fillInWhenClauseText1(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value1]`)
            .clear({force: true});
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value1]`)
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText1(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value1]`)
            .should('have.value', val);
        return this;
    }
    fillInWhenClauseText2(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value2]`)
            .clear({force: true});
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value2]`)
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText2(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value2]`)
            .should('have.value', val);
        return this;
    }
    fillInWhenClauseText3(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value3]`)
            .clear({force: true});
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value3]`)
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText3(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value3]`)
            .should('have.value', val);
        return this;
    }
    fillInWhenClauseText4(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value4]`)
            .clear({force: true});
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value4]`)
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText4(whenClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value4]`)
            .should('have.value', val);
        return this;
    }

    fillInValidateClauseText1(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value1]`)
            .clear({force: true});
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value1]`)
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText1(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value1]`)
            .should('have.value',val);
        return this;
    }

    fillInValidateClauseText2(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value2]`)
            .clear({force: true});
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value2]`)
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText2(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value2]`)
            .should('have.value', val);
        return this;
    }
    fillInValidateClauseText3(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value3]`)
            .clear({force: true});
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value3]`)
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText3(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value3]`)
            .should('have.value', val);
        return this;
    }
    fillInValidateClauseText4(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value4]`)
            .clear({force: true});
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value4]`)
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText4(validateClauseIndex: number, fieldsContainerIndex: number, val: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container='${fieldsContainerIndex}']`)
            .find(`[test-field-value4]`)
            .should('have.value', val);
        return this;
    }
    // todo: needs changing fieldsContainerIndex needs to go, val turns into array, index of array is fieldContainerIndex
    fillInWhenClauseStringAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
        this.selectWhenClauseOperator(whenClauseIndex, op)
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, val[i]);
        });
        return this;
    }
    verifyWhenClauseStringAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, val[i]);
        });
        return this;
    }
    fillInWhenClauseTextAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, val[i]);
        });
        return this;
    }
    verifyWhenClauseTextAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, val[i]);
        });
        return this;
    }
    fillInWhenClauseSelectAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, key: string[]): AbstractViewPredefinedRulePage{
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(key.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(key).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, key[i]);
        });
        return this;
    }
    verifyWhenClauseSelectAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, key: string[]): AbstractViewPredefinedRulePage{
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(key).each((e, i, a) => {
            this.verifyValidateClauseText1(whenClauseIndex, i, key[i]);
        });
        return this;
    }
    fillInWhenClauseDoubleSelectAttribute(whenClauseIndex: number, attributeName: string,op: OperatorType, v: {key1: string, key2: string}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, v[i].key1)
                .fillInWhenClauseText2(whenClauseIndex, i, v[i].key2)
        });
        return this;
    }
    verifyWhenClauseDoubleSelectAttribute(whenClauseIndex: number, attributeName: string,op: OperatorType, v: {key1: string, key2: string}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(whenClauseIndex, i, v[i].key1)
                .verifyValidateClauseText2(whenClauseIndex, i, v[i].key2);
        });
        return this;
    }
    fillInWhenClauseNumberAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, String(val[i]));
        });
        return this;
    }
    verifyWhenClauseNumberAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, String(val[i]));
        });
        return this;
    }
    fillInWhenClauseDateAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string[] /* DD-MM-YYYY */): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, val[i]);
        });
        return this;
    }
    verifyWhenClauseDateAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string[] /* DD-MM-YYYY */): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, val[i]);
        });
        return this;
    }
    fillInWhenClauseCurrencyAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: string, unit: CountryCurrencyUnits}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, v[i].val)
                .fillInWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyWhenClauseCurrencyAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: string, unit: CountryCurrencyUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, v[i].val)
                .verifyWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInWhenClauseVolumeAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: VolumeUnits}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .fillInWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyWhenClauseVolumeAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: VolumeUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .verifyWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInWhenClauseAreaAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: AreaUnits}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .fillInWhenClauseText2(whenClauseIndex, i, v[i].unit)
        });
        return this;
    }
    verifyWhenClauseAreaAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: AreaUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .verifyWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInWhenClauseDimensionAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val1: number, val2: number, val3: number, unit: DimensionUnits}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, String(v[i].val1))
                .fillInWhenClauseText2(whenClauseIndex, i, String(v[i].val2))
                .fillInWhenClauseText3(whenClauseIndex, i, String(v[i].val3))
                .fillInWhenClauseText4(whenClauseIndex, i, v[i].unit)
        });
        return this;
    }
    verifyWhenClauseDimensionAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val1: number, val2: number, val3: number, unit: DimensionUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, String(v[i].val1))
                .verifyWhenClauseText2(whenClauseIndex, i, String(v[i].val2))
                .verifyWhenClauseText3(whenClauseIndex, i, String(v[i].val3))
                .verifyWhenClauseText4(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInWhenClauseWidthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: WidthUnits}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .fillInWhenClauseText2(whenClauseIndex, i, v[i].unit)
        });
        return this;
    }
    verifyWhenClauseWidthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: WidthUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .verifyWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInWhenClauseLengthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: LengthUnits}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .fillInWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyWhenClauseLengthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: LengthUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .verifyWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInWhenClauseHeightAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: HeightUnits}[]): AbstractViewPredefinedRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(whenClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .fillInWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyWhenClauseHeightAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: HeightUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyWhenClauseText1(whenClauseIndex, i, String(v[i].val))
                .verifyWhenClauseText2(whenClauseIndex, i, v[i].unit);
        });
        return this;
    }
    ////////////// validate clauses

    fillInValidateClauseStringAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, val[i]);
        });
        return this;
    }
    verifyValidateClauseStringAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, val[i]);
        });
        return this;
    }
    fillInValidateClauseTextAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, val[i]);
        });
        return this;
    }
    verifyValidateClauseTextAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, val[i]);
        });
        return this;
    }
    fillInValidateClauseSelectAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, key: string[]): AbstractViewPredefinedRulePage{
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(key.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(key).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, key[i]);
        });
        return this;
    }
    verifyValidateClauseSelectAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, key: string): AbstractViewPredefinedRulePage{
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(key).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, key[i]);
        });
        return this;
    }
    fillInValidateClauseDoubleSelectAttribute(validateClauseIndex: number, attributeName: string,op: OperatorType, v: {key1: string, key2: string}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, v[i].key1)
                .fillInValidateClauseText2(validateClauseIndex, i, v[i].key2);
        });
        return this;
    }
    verifyValidateClauseDoubleSelectAttribute(validateClauseIndex: number, attributeName: string,op: OperatorType, v: {key1: string, key2: string}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, v[i].key1)
                .verifyValidateClauseText2(validateClauseIndex, i, v[i].key2);
        });
        return this;
    }
    fillInValidateClauseNumberAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, String(val[i]));
        });
        return this;
    }
    verifyValidateClauseNumberAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, String(val[i]));
        });
        return this;
    }
    fillInValidateClauseDateAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string[] /* DD-MM-YYYY */): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(val.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(val).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, val[i])
        });
        return this;
    }
    verifyValidateClauseDateAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string[] /* DD-MM-YYYY */): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(val).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, val[i]);
        });
        return this;
    }
    fillInValidateClauseCurrencyAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: string, unit: CountryCurrencyUnits}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, v[i].val)
                .fillInValidateClauseText2(validateClauseIndex, i, v[i].unit)
        });
        return this;
    }
    verifyValidateClauseCurrencyAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: string, unit: CountryCurrencyUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, v[i].val)
                .verifyValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInValidateClauseVolumeAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: VolumeUnits}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .fillInValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyValidateClauseVolumeAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: VolumeUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .verifyValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInValidateClauseAreaAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: AreaUnits}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .fillInValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyValidateClauseAreaAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: AreaUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .verifyValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInValidateClauseDimensionAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val1: number, val2: number, val3: number, unit: DimensionUnits}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, String(v[i].val1))
                .fillInValidateClauseText2(validateClauseIndex, i, String(v[i].val2))
                .fillInValidateClauseText3(validateClauseIndex, i, String(v[i].val2))
                .fillInValidateClauseText4(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyValidateClauseDimensionAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val1: number, val2: number, val3: number, unit: DimensionUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, String(v[i].val1))
                .verifyValidateClauseText2(validateClauseIndex, i, String(v[i].val2))
                .verifyValidateClauseText3(validateClauseIndex, i, String(v[i].val3))
                .verifyValidateClauseText4(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInValidateClauseWidthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: WidthUnits}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .fillInValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyValidateClauseWidthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: WidthUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .verifyValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInValidateClauseLengthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: LengthUnits}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .fillInValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyValidateClauseLengthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: LengthUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .verifyValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    fillInValidateClauseHeightAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: HeightUnits}[]): AbstractViewPredefinedRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddValidateClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.fillInValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .fillInValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }
    verifyValidateClauseHeightAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, v: {val: number, unit: HeightUnits}[]): AbstractViewPredefinedRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op);
        cy.wrap(v.filter((v, i) => i !== 0)).each((e, i, a) => {
            this.clickAddWhenClauseCondition(validateClauseIndex);
        });
        cy.wrap(v).each((e, i, a) => {
            this.verifyValidateClauseText1(validateClauseIndex, i, String(v[i].val))
                .verifyValidateClauseText2(validateClauseIndex, i, v[i].unit);
        });
        return this;
    }

    //// === end validation clauses


    verifyRuleName(ruleName: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-field-rule-name]`).should('have.value', ruleName);
        return this;
    }

    verifyRuleDescription(ruleDescription: string): AbstractViewPredefinedRulePage {
        cy.get(`[test-field-rule-description]`).should('have.value', ruleDescription);
        return this;
    }

    clickAddWhenClauseCondition(whenClauseIndex: number): AbstractViewPredefinedRulePage {
       cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
           .find(`[test-button-add-condition]`)
           .click({force: true});
       return this;
    }

    clickAddValidateClauseCondition(validateClauseIndex: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-button-add-condition]`)
            .click({force: true});
        return this;
    }

    clickRemoveWhenClauseCondition(whenClauseIndex: number, index: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-button-remove-condition='${index}']`)
            .click({force: true});
        return this;
    }

    clickRemoveValidateClauseCondition(validateClauseIndex: number, index: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-button-remove-condition='${index}']`)
            .click({force: true});
        return this;
    }

    verifyValidateClauseConditionCount(validateClauseIndex: number, count: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-fields-container]`)
            .should('have.length', count)
        return this;
    }

    verifyWhenClauseConditionCount(whenClauseIndex: number, count: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-fields-container]`)
            .should('have.length', count)
        return this;
    }

    verifyValidateClauseSize(size: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-validate-clause-attribute-editor]`).should('have.length', size);
       return this;
    }

    verifyWhenClauseSize(size: number): AbstractViewPredefinedRulePage {
        cy.get(`[test-when-clause-attribute-editor]`).should('have.length', size);
        return this;
    }
}
