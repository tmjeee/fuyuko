import {ActualPage} from "../../actual.page";
import * as util from "../../../util/util";

interface AcutalPage {
}

export class ViewCustomRulePage implements ActualPage<ViewCustomRulePage> {

    validateTitle(): ViewCustomRulePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-rules');
        return this;
    }

    verifyErrorMessageExists(): ViewCustomRulePage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewCustomRulePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    visit(): ViewCustomRulePage {
        cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        return this;
    }

    waitForReady(): ViewCustomRulePage {
        return this;
    }


    verifyCustomTabSelected(): ViewCustomRulePage {
        cy.get(`[test-tab='custom']`).should('be.visible');
        return this;
    }

    ///////////////////


    clickShowCustomRulesList(): ViewCustomRulePage {
        cy.get(`[test-button-show-custom-rule-list]`).click({force: true});
        return this;
    }

    clickHideCustomRulesList(): ViewCustomRulePage {
        cy.get(`[test-button-hide-custom-rule-list]`).click({force: true});
        return this;
    }

    verifyCustomRuleListOpen(b: boolean): ViewCustomRulePage {
        cy.get(`[test-custom-rule-list-shown]`).should(b ? 'be.visible' : 'not.be.visible');
        return this;
    }

    checkCustomRuleListCheckbox(customRuleName: string):ViewCustomRulePage {
        cy.get(`[test-checkbox-custom-rule='${customRuleName}']`).then((elem) => {
            const isChecked = elem.hasClass('mat-checkbox-checked');
            if (!isChecked) {
                return cy.get(`[test-checkbox-custom-rule='${customRuleName}']`)
                    .find(`input`).click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    uncheckCustomRuleListCheckbox(customRuleName: string): ViewCustomRulePage {
        cy.get(`[test-checkbox-custom-rule='${customRuleName}']`).then((elem) => {
            const isChecked = elem.hasClass('mat-checkbox-checked');
            if (isChecked) {
                return cy.get(`[test-checkbox-custom-rule='${customRuleName}']`)
                    .find(`input`).click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    clickCustomRuleListUpdateButton(): ViewCustomRulePage {
        cy.get(`[test-button-update-custom-rule-list]`).click({force: true});
        return this;
    }

    verifyCustomRuleExpantionPanelExists(ruleName: string, b: boolean):ViewCustomRulePage {
        cy.get(`[test-expansion-panel-header='${ruleName}']`).should(b ? 'exist' :  'not.exist');
        return this;
    }

    clickEnableRule(ruleName: string): ViewCustomRulePage {
        cy.get(`[test-icon-enable-rule='${ruleName}']`).click({force: true});
        return this;
    }

    clickDisableRule(ruleName: string): ViewCustomRulePage {
        cy.get(`[test-icon-disable-rule='${ruleName}']`).click({force: true});
        return this;
    }

    verifyRuleEnabled(ruleName: string, b: boolean): ViewCustomRulePage {
        cy.get(`[test-expansion-panel='${ruleName}']`)
            .should('have.attr', 'test-rule-status', b ? 'enabled' : 'disabled');
        return this;
    }

    disableRule(ruleName: string): ViewCustomRulePage {
        cy.get(`[test-icon-disable-rule='${ruleName}']`).click({force: true});
        return this;
    }

    enableRule(ruleName: string): ViewCustomRulePage {
        cy.get(`[test-icon-enable-rule='${ruleName}']`).click({force: true});
        return this;
    }

    deleteRule(ruleName: string): ViewCustomRulePage {
        cy.get(`[test-icon-remove-rule='${ruleName}']`).click({force: true});
        return this;
    }

    verifyRulePanelExists(ruleName: string, b: boolean): ViewCustomRulePage {
        cy.get(`[test-panel-header-rule='${ruleName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }
}