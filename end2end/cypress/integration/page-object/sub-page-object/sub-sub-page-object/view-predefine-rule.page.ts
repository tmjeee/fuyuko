import {ActualPage} from "../../actual.page";
import * as util from "../../../util/util";
import {ViewPredefinedRuleEditPage} from "./view-predefined-rule-edit.page";
import {ViewPredefinedRuleAddPage} from "./view-predefined-rule-add.page";
import {OperatorType} from "../../../model/operator.model";


export class ViewPredefinedRulePage implements ActualPage<ViewPredefinedRulePage>{

    validateTitle(): ViewPredefinedRulePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-rules');
        return this;
    }

    verifyErrorMessageExists(): ViewPredefinedRulePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewPredefinedRulePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    visit(): ViewPredefinedRulePage {
        cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        return this;
    }

    verifyPredefinedTabSelected(): ViewPredefinedRulePage {
        cy.get(`[test-tab='predefined']`).should('be.visible');
        return this;
    }

    /////////////////////


    togglePanel(ruleName: string): ViewPredefinedRulePage {
        cy.get(`[test-panel-header-rule='${ruleName}']`).click({force: true});
        return this;
    }


    verifyPanelExpanded(ruleName: string, b: boolean): ViewPredefinedRulePage {
        cy.wait(100).get(`[test-panel-content-rule='${ruleName}']`).should(b ? 'be.visible' : 'not.be.visible');
        return this;
    }

    verifyPanelRuleDisabled(ruleName: string): ViewPredefinedRulePage {
        cy.get(`[test-panel-header-rule='${ruleName}']`).should('have.attr', 'test-panel-rule-status', 'DISABLED');
        return this;
    }

    verifyPanelRuleEnabled(ruleName: string): ViewPredefinedRulePage {
        cy.get(`[test-panel-header-rule='${ruleName}']`).should('have.attr', 'test-panel-rule-status', 'ENABLED');
        return this;
    }


    verifyTabSelected(tabId: string): ViewPredefinedRulePage {
        cy.get(`[test-tab='${tabId}']`).should('be.visible');
        return this;
    }

    disableRule(ruleName: string): ViewPredefinedRulePage {
        cy.get(`[test-icon-disable-rule='${ruleName}']`).click({force: true});
        return this;
    }

    enableRule(ruleName: string): ViewPredefinedRulePage {
        cy.get(`[test-icon-enable-rule='${ruleName}']`).click({force: true});
        return this;
    }

    deleteRule(ruleName: string): ViewPredefinedRulePage {
        cy.get(`[test-icon-remove-rule='${ruleName}']`).click({force: true});
        return this;
    }

    editRule(ruleName: string): ViewPredefinedRuleEditPage {
        cy.get(`[test-icon-edit-rule='${ruleName}']`).click({force: true});
        return new ViewPredefinedRuleEditPage();
    }

    clickAddRule(): ViewPredefinedRuleAddPage {
        cy.get(`[test-button-add-rule]`).click({force: true});
        return new ViewPredefinedRuleAddPage();
    }


    verifyRulePanelExists(ruleName: string, b: boolean): ViewPredefinedRulePage {
        cy.get(`[test-panel-header-rule='${ruleName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }

    verifyPanelWhenClauseContains(ruleName: string, attributeName: string, operator: OperatorType, vals: string[]): ViewPredefinedRulePage {
        cy.get(`[test-panel-content-rule='${ruleName}']`)
            .find(`[test-panel-when-clause-attribute='${attributeName}']`)
            .should('contain.text', attributeName);
        cy.get(`[test-panel-content-rule='${ruleName}']`)
            .find(`[test-panel-when-clause-attribute='${attributeName}']`)
            .should('contain.text',operator);
        cy.wrap(vals).each((e, i, a) => {
            return cy.get(`[test-panel-content-rule='${ruleName}']`)
                .find(`[test-panel-when-clause-attribute='${attributeName}']`)
                .should('contain.text', vals[i]);
        });
        return this;
    }


    verifyPanelValidateClauseContains(ruleName: string, attributeName: string, operator: OperatorType, vals: string[]): ViewPredefinedRulePage {
        cy.get(`[test-panel-content-rule='${ruleName}']`)
            .find(`[test-panel-validate-clause-attribute='${attributeName}']`)
            .should('contain.text', attributeName);
        cy.get(`[test-panel-content-rule='${ruleName}']`)
            .find(`[test-panel-validate-clause-attribute='${attributeName}']`)
            .should('contain.text',operator);
        cy.wrap(vals).each((e, i, a) => {
            return cy.get(`[test-panel-content-rule='${ruleName}']`)
                .find(`[test-panel-validate-clause-attribute='${attributeName}']`)
                .should('contain.text', vals[i]);
        });
        return this;
    }

    clickDeleteRule(ruleName: string): ViewPredefinedRulePage {
        cy.get(`[test-icon-remove-rule='${ruleName}']`).click({force: true});
        return this;
    }

    clickEditRule(ruleName: string): ViewPredefinedRuleEditPage {
        cy.get(`[test-icon-edit-rule='${ruleName}']`).click({force: true});
        return new ViewPredefinedRuleEditPage();
    }
}
