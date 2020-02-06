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

export class AbstractViewRulePage {

    verifyErrorMessageExists(): AbstractViewRulePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): AbstractViewRulePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    verifySubmittable(b: boolean): AbstractViewRulePage {
        cy.get(`[test-button-done]`).should(b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    submit(): AbstractViewRulePage {
        cy.get(`[test-button-done]`).click({force: true});
        return this;
    }
    cancel(): ViewRulePage {
        cy.get(`[test-button-cancel]`).click({force: true});
        return new ViewRulePage();
    }

    addValidateClause(): AbstractViewRulePage {
        cy.get(`[test-button-add-rule-validate-clause]`).click({force: true});
        return this;
    }

    deleteValidateClause(index: number): AbstractViewRulePage {
        cy.get(`[test-button-delete-rule-validate-clause='${index}']`).click({force: true});
        return this;
    }

    addWhenClause(): AbstractViewRulePage {
        cy.get(`[test-button-add-rule-when-clause]`).click({force: true});
        return this;
    }

    deleteWhenClause(index: number): AbstractViewRulePage {
        cy.get(`[test-button-delete-rule-when-clause='${index}']`).click({force: true});
        return this;
    }
    removeValidateClause(index: number): AbstractViewRulePage {
        cy.get(`[test-button-delete-rule-validate-clause='${index}']`).click({force: true});
        return this;
    }

    removeWhenClause(index: number): AbstractViewRulePage {
        cy.get(`[test-button-delete-rule-when-clause='${index}']`).click({force: true});
        return this;
    }

    verifyValidateClauseCount(count: number): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor]`).should('have.length', count);
        return this;
    }

    verifyWhenClauseCount(count: number): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor]`).should('have.length', count);
        return this;
    }


    selectWhenClauseAttribute(whenClauseIndex: number, attributeName: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute]`).click({force: true});
        cy.get(`[test-select-option-attribute='${attributeName}']`).click({force: true});
        return this;
    }

    verifyWhenClauseAttributeSelected(whenClauseIndex: number, attributeName: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should('have.text', attributeName)
        ;

        return this;
    }

    selectValidateClauseAttribute(validateClauseIndex: number, attributeName: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute]`).click({force: true});
        cy.get(`[test-select-option-attribute='${attributeName}']`).click({force: true});
        return this;
    }


    verifyValidateClauseAttributeSelected(validateClauseIndex: number, attributeName: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should('have.text', attributeName)
        ;
        return this;
    }

    selectWhenClauseOperator(whenClauseIndex: number, operator: OperatorType): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute-operator]`).click({force: true});
        cy.get(`[test-select-option-attribute-operator='${operator}']`).click({force: true});
        return this;
    }

    verifyWhenClauseOperatorSelected(whenClauseIndex: number, operator: OperatorType): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute-operator]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should(`have.text`, operator);
        return this;
    }

    selectValidateClauseOperator(validateClauseIndex: number, operator: OperatorType): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute-operator]`).click({force: true});
        cy.get(`[test-select-option-attribute-operator='${operator}']`).click({force: true});
        return this;
    }

    verifyValidateClauseOperatorSelected(validateClauseIndex: number, operator: OperatorType): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute-operator]`)
            .find(`.mat-select-value`)
            .find(`span`)
            .find(`span`)
            .should(`have.text`, operator);
        return this;
    }

    verifyValidateClauseField1Exists(validateClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value1]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyValidateClauseField2Exists(validateClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value2]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyValidateClauseField3Exists(validateClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value3]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyValidateClauseField4Exists(validateClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value4]`).should(b ? 'exist' : 'not.exist');
        return this;
    }


    verifyWhenClauseField1Exists(whenClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value1]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyWhenClauseField2Exists(whenClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value2]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyWhenClauseField3Exists(whenClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value3]`).should(b ? 'exist' : 'not.exist');
        return this;
    }
    verifyWhenClauseField4Exists(whenClauseIndex: number, b: boolean): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value4]`).should(b ? 'exist' : 'not.exist');
        return this;
    }


    fillInRuleName(name: string): AbstractViewRulePage {
        cy.get(`[test-field-rule-name]`).clear({force: true}).type(name, {force: true});
        return this;
    }

    fillInRuleDescription(description: string): AbstractViewRulePage {
        cy.get(`[test-field-rule-description]`).clear({force: true}).type(description, {force: true});
        return this;
    }

    fillInWhenClauseText1(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value1]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText1(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value1]`)
            .should('have.value', val);
        return this;
    }
    fillInWhenClauseText2(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value2]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText2(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value2]`)
            .should('have.value', val);
        return this;
    }
    fillInWhenClauseText3(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value3]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText3(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value3]`)
            .should('have.value', val);
        return this;
    }
    fillInWhenClauseText4(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value4]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyWhenClauseText4(whenClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-field-value4]`)
            .should('have.value', val);
        return this;
    }

    fillInValidateClauseText1(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value1]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText1(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value1]`)
            .should('have.value',val);
        return this;
    }

    fillInValidateClauseText2(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value2]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText2(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value2]`)
            .should('have.value', val);
        return this;
    }
    fillInValidateClauseText3(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value3]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText3(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value3]`)
            .should('have.value', val);
        return this;
    }
    fillInValidateClauseText4(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value4]`)
            .clear({force: true})
            .type(val, {force: true});
        return this;
    }
    verifyValidateClauseText4(validateClauseIndex: number, val: string): AbstractViewRulePage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-field-value4]`)
            .should('have.value', val);
        return this;
    }

    fillInWhenClauseStringAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, val);
        return this;
    }
    verifyWhenClauseStringAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, val);
        return this;
    }
    fillInWhenClauseTextAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, val);
        return this;
    }
    verifyWhenClauseTextAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, val);
        return this;
    }
    fillInWhenClauseSelectAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, key: string): AbstractViewRulePage{
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, key);
        return this;
    }
    verifyWhenClauseSelectAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, key: string): AbstractViewRulePage{
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyValidateClauseText1(whenClauseIndex, key);
        return this;
    }
    fillInWhenClauseDoubleSelectAttribute(whenClauseIndex: number,  attributeName: string,op: OperatorType, key1: string, key2: string): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, key1)
            .fillInWhenClauseText2(whenClauseIndex, key1)
        ;
        return this;
    }
    verifyWhenClauseDoubleSelectAttribute(whenClauseIndex: number,  attributeName: string,op: OperatorType, key1: string, key2: string): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyValidateClauseText1(whenClauseIndex, key1)
            .verifyValidateClauseText2(whenClauseIndex, key2);
        return this;
    }
    fillInWhenClauseNumberAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, String(val))
        ;
        return this;
    }
    verifyWhenClauseNumberAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, String(val));
        return this;
    }
    fillInWhenClauseDateAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string /* DD-MM-YYYY */): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, val)
        ;
        return this;
    }
    verifyWhenClauseDateAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string /* DD-MM-YYYY */): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, val);
        return this;
    }
    fillInWhenClauseCurrencyAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string, unit: CountryCurrencyUnits): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, val)
            .fillInWhenClauseText2(whenClauseIndex, unit)
        ;
        return this;
    }
    verifyWhenClauseCurrencyAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: string, unit: CountryCurrencyUnits): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, val)
            .verifyWhenClauseText2(whenClauseIndex, unit);
        return this;
    }
    fillInWhenClauseVolumeAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: VolumeUnits): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, String(val))
            .fillInWhenClauseText2(whenClauseIndex, unit)
        ;
        return this;
    }
    verifyWhenClauseVolumeAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: VolumeUnits): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, String(val))
            .verifyWhenClauseText2(whenClauseIndex, unit);
        return this;
    }
    fillInWhenClauseAreaAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: AreaUnits): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, String(val))
            .fillInWhenClauseText2(whenClauseIndex, unit)
        ;
        return this;
    }
    verifyWhenClauseAreaAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: AreaUnits): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, String(val))
            .verifyWhenClauseText2(whenClauseIndex, unit);
        return this;
    }
    fillInWhenClauseDimensionAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val1: number, val2: number, val3: number, unit: DimensionUnits): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, String(val1))
            .fillInWhenClauseText2(whenClauseIndex, String(val2))
            .fillInWhenClauseText3(whenClauseIndex, String(val2))
            .fillInWhenClauseText4(whenClauseIndex, unit)
        ;
        return this;
    }
    verifyWhenClauseDimensionAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val1: number, val2: number, val3: number, unit: DimensionUnits): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, String(val1))
            .verifyWhenClauseText2(whenClauseIndex, String(val2))
            .verifyWhenClauseText3(whenClauseIndex, String(val3))
            .verifyWhenClauseText4(whenClauseIndex, unit);
        return this;
    }
    fillInWhenClauseWidthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: WidthUnits): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, String(val))
            .fillInWhenClauseText2(whenClauseIndex, unit)
        ;
        return this;
    }
    verifyWhenClauseWidthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: WidthUnits): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, String(val))
            .verifyWhenClauseText2(whenClauseIndex, unit);
        return this;
    }
    fillInWhenClauseLengthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: LengthUnits): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, String(val))
            .fillInWhenClauseText2(whenClauseIndex, unit)
        ;
        return this;
    }
    verifyWhenClauseLengthAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: LengthUnits): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, String(val))
            .verifyWhenClauseText2(whenClauseIndex, unit);
        return this;
    }
    fillInWhenClauseHeightAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: HeightUnits): AbstractViewRulePage {
        this.selectWhenClauseAttribute(whenClauseIndex, attributeName)
            .selectWhenClauseOperator(whenClauseIndex, op)
            .fillInWhenClauseText1(whenClauseIndex, String(val))
            .fillInWhenClauseText2(whenClauseIndex, unit)
        ;
        return this;
    }
    verifyWhenClauseHeightAttribute(whenClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: HeightUnits): AbstractViewRulePage {
        this.verifyWhenClauseAttributeSelected(whenClauseIndex, attributeName)
            .verifyWhenClauseOperatorSelected(whenClauseIndex, op)
            .verifyWhenClauseText1(whenClauseIndex, String(val))
            .verifyWhenClauseText2(whenClauseIndex, unit);
        return this;
    }
    //////////////

    fillInValidateClauseStringAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, val);
        return this;
    }
    verifyValidateClauseStringAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, val);
        return this;
    }
    fillInValidateClauseTextAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, val);
        return this;
    }
    verifyValidateClauseTextAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, val);
        return this;
    }
    fillInValidateClauseSelectAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, key: string): AbstractViewRulePage{
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, key);
        return this;
    }
    verifyValidateClauseSelectAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, key: string): AbstractViewRulePage{
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, key);
        return this;
    }
    fillInValidateClauseDoubleSelectAttribute(validateClauseIndex: number,  attributeName: string,op: OperatorType, key1: string, key2: string): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, key1)
            .fillInValidateClauseText2(validateClauseIndex, key1)
        ;
        return this;
    }
    verifyValidateClauseDoubleSelectAttribute(validateClauseIndex: number,  attributeName: string,op: OperatorType, key1: string, key2: string): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, key1)
            .verifyValidateClauseText2(validateClauseIndex, key2);
        return this;
    }
    fillInValidateClauseNumberAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, String(val))
        ;
        return this;
    }
    verifyValidateClauseNumberAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, String(val));
        return this;
    }
    fillInValidateClauseDateAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string /* DD-MM-YYYY */): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, val)
        ;
        return this;
    }
    verifyValidateClauseDateAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string /* DD-MM-YYYY */): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, val);
        return this;
    }
    fillInValidateClauseCurrencyAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string, unit: CountryCurrencyUnits): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, val)
            .fillInValidateClauseText2(validateClauseIndex, unit)
        ;
        return this;
    }
    verifyValidateClauseCurrencyAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: string, unit: CountryCurrencyUnits): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, val)
            .verifyValidateClauseText2(validateClauseIndex, unit);
        return this;
    }
    fillInValidateClauseVolumeAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: VolumeUnits): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, String(val))
            .fillInValidateClauseText2(validateClauseIndex, unit)
        ;
        return this;
    }
    verifyValidateClauseVolumeAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: VolumeUnits): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, String(val))
            .verifyValidateClauseText2(validateClauseIndex, unit);
        return this;
    }
    fillInValidateClauseAreaAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: AreaUnits): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, String(val))
            .fillInValidateClauseText2(validateClauseIndex, unit)
        ;
        return this;
    }
    verifyValidateClauseAreaAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: AreaUnits): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, String(val))
            .verifyValidateClauseText2(validateClauseIndex, unit);
        return this;
    }
    fillInValidateClauseDimensionAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val1: number, val2: number, val3: number, unit: DimensionUnits): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, String(val1))
            .fillInValidateClauseText2(validateClauseIndex, String(val2))
            .fillInValidateClauseText3(validateClauseIndex, String(val2))
            .fillInValidateClauseText4(validateClauseIndex, unit)
        ;
        return this;
    }
    verifyValidateClauseDimensionAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val1: number, val2: number, val3: number, unit: DimensionUnits): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, String(val1))
            .verifyValidateClauseText2(validateClauseIndex, String(val2))
            .verifyValidateClauseText3(validateClauseIndex, String(val3))
            .verifyValidateClauseText4(validateClauseIndex, unit);
        return this;
    }
    fillInValidateClauseWidthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: WidthUnits): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, String(val))
            .fillInValidateClauseText2(validateClauseIndex, unit)
        ;
        return this;
    }
    verifyValidateClauseWidthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: WidthUnits): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, String(val))
            .verifyValidateClauseText2(validateClauseIndex, unit);
        return this;
    }
    fillInValidateClauseLengthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: LengthUnits): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, String(val))
            .fillInValidateClauseText2(validateClauseIndex, unit)
        ;
        return this;
    }
    verifyValidateClauseLengthAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: LengthUnits): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, String(val))
            .verifyValidateClauseText2(validateClauseIndex, unit);
        return this;
    }
    fillInValidateClauseHeightAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: HeightUnits): AbstractViewRulePage {
        this.selectValidateClauseAttribute(validateClauseIndex, attributeName)
            .selectValidateClauseOperator(validateClauseIndex, op)
            .fillInValidateClauseText1(validateClauseIndex, String(val))
            .fillInValidateClauseText2(validateClauseIndex, unit)
        ;
        return this;
    }
    verifyValidateClauseHeightAttribute(validateClauseIndex: number, attributeName: string, op: OperatorType, val: number, unit: HeightUnits): AbstractViewRulePage {
        this.verifyValidateClauseAttributeSelected(validateClauseIndex, attributeName)
            .verifyValidateClauseOperatorSelected(validateClauseIndex, op)
            .verifyValidateClauseText1(validateClauseIndex, String(val))
            .verifyValidateClauseText2(validateClauseIndex, unit);
        return this;
    }


    verifyRuleName(ruleName: string): AbstractViewRulePage {
        cy.get(`[test-field-rule-name]`).should('have.value', ruleName);
        return this;
    }

    verifyRuleDescription(ruleDescription: string): AbstractViewRulePage {
        cy.get(`[test-field-rule-description]`).should('have.value', ruleDescription);
        return this;
    }
}
