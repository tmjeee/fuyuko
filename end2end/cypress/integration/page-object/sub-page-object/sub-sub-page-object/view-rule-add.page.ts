import {ViewRulePage} from "../view-rule.page";
import * as util from "../../../util/util";
import {OperatorType} from "../../../model/operator.model";

export class ViewRuleAddPage {


    validateTitle(): ViewRuleAddPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-rules');
        return this;
    }

    visit(): ViewRuleAddPage {
        cy.visit(`/view-gen-layout/(add-rule//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewRuleAddPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewRuleAddPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    submit(): ViewRuleAddPage {
        cy.get(`[test-button-done]`).click({force: true});
        return this;
    }
    cancel(): ViewRulePage {
        cy.get(`[test-button-cancel]`).click({force: true});
        return new ViewRulePage();
    }

    addValidateClause(): ViewRuleAddPage {
        cy.get(`[test-button-add-rule-validate-clause]`).click({force: true});
        return this;
    }

    addWhenClause(): ViewRuleAddPage {
        cy.get(`[test-button-add-rule-when-clause]`).click({force: true});
        return this;
    }

    removeValidateClause(index: number): ViewRuleAddPage {
        cy.get(`[test-button-delete-rule-validate-clause='${index}']`).click({force: true});
        return this;
    }

    removeWhenClause(index: number): ViewRuleAddPage {
        cy.get(`[test-button-delete-rule-when-clause='${index}']`).click({force: true});
        return this;
    }

    verifyValidateClauseCount(count: number): ViewRuleAddPage {
        cy.get(`[test-validate-clause-attribute-editor]`).should('have.length', count);
        return this;
    }

    verifyWhenClauseCount(count: number): ViewRuleAddPage {
        cy.get(`[test-when-clause-attribute-editor]`).should('have.length', count);
        return this;
    }


    selectWhenClauseAttribute(whenClauseIndex: number, attributeName: string): ViewRuleAddPage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute]`).click({force: true})
            .find(`[test-select-option-attribute='${attributeName}']`).click({force: true});
        return this;
    }

    selectValidateClauseAttribute(validateClauseIndex: number, attributeName: string): ViewRuleAddPage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute]`).click({force: true})
            .find(`[test-select-option-attribute='${attributeName}']`).click({force: true});
        return this;
    }

    selectWhenClauseOperator(whenClauseIndex: number, operator: OperatorType): ViewRuleAddPage {
        cy.get(`[test-when-clause-attribute-editor='${whenClauseIndex}']`)
            .find(`[test-select-attribute-operator]`).click({force: true})
            .find(`[test-select-option-attribute-operator='${operator}']`).click({force: true});
        return this;
    }

    selectValidateClauseOperator(validateClauseIndex: number, operator: OperatorType): ViewRuleAddPage {
        cy.get(`[test-validate-clause-attribute-editor='${validateClauseIndex}']`)
            .find(`[test-select-attribute-operator]`).click({force: true})
            .find(`[test-select-option-attribute-operator='${operator}']`).click({force: true});
        return this;
    }
}